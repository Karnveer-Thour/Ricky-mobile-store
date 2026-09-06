import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { parse } from 'fast-csv';
import { createReadStream } from 'fs';
import { deleteFile } from 'Common/Utils/Utils';
import { Product } from '../Entities/Product.entity';
import { CreateProductDto } from '../Dtos/create-product.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { CategoryRepository } from 'Modules/Category/Repositories/Category.repo';

@Injectable()
export class ProductCsvService {
  async downloadCSV(products: Product[], res: Response): Promise<void> {
    try {
      const fields = [
        'id',
        'name',
        'category',
        'price',
        'discount',
        'quantity',
        'warranty',
        'description',
        'specifications',
        'colors',
      ];

      const formattedProducts = (products || []).map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category?.name || '',
        price: product.price,
        discount: product.discount || 0,
        quantity: product.quantity || 0,
        warranty: product.warranty || '1 Year Official Warranty',
        description: product.description || '',
        specifications: product.specifications || '',
        colors: product.variants?.length
          ? product.variants
              .map((v) =>
                `${v.ram ? v.ram + ' ' : ''}${v.storage ? v.storage + ' ' : ''}${
                  v.color || 'Standard'
                } (${v.quantity})`.trim(),
              )
              .join(', ')
          : product.colors?.length
            ? product.colors.map((c) => `${c.name} (${c.quantity})`).join(', ')
            : `Default (${product.quantity || 0})`,
      }));

      const parser = new Parser({ fields });
      const csv = parser.parse(formattedProducts);

      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename=products.csv');
      res.status(200).send(csv);
    } catch (error) {
      console.error('Backend downloadCSV error:', error);
      if (!res.headersSent) {
        res.status(500).json({ status: false, message: 'Unable to download CSV' });
      }
    }
  }

  async uploadCSV(
    filePath: string,
    categoryRepository: CategoryRepository,
    createProductFn: (dto: CreateProductDto) => Promise<any>,
  ): Promise<baseResponseDto> {
    const products: Partial<Product>[] = [];

    return new Promise((resolve, reject) => {
      const stream = createReadStream(filePath)
        .pipe(parse({ headers: true, ignoreEmpty: true, trim: true }))
        .on('error', (err) => {
          console.error('CSV stream error:', err);
          deleteFile(filePath);
          reject(new InternalServerErrorException('CSV parsing failed'));
        })
        .on('data', async (rawRow) => {
          stream.pause();

          try {
            // Normalize row keys to lowercase and trim
            const row: Record<string, string> = {};
            for (const key of Object.keys(rawRow)) {
              row[key.toLowerCase().trim()] = rawRow[key];
            }

            const name = (row['product name'] || row['name'] || row['product'] || '').trim();

            const rawPrice =
              row['price (inr)'] || row['price'] || row['mrp price (₹)'] || row['mrp'] || '0';

            const rawCategory = (row['category (select dropdown)'] || row['category'] || '').trim();

            const rawDiscount =
              row['discount (inr)'] || row['discount (₹)'] || row['discount'] || '0';

            const rawQuantity =
              row['total stock'] ||
              row['stock count'] ||
              row['total quantity'] ||
              row['quantity'] ||
              '10';

            const rawColors =
              row['color variants & stock'] ||
              row['color variants breakdown'] ||
              row['color variants'] ||
              row['colors'] ||
              '';

            const warranty = (row['warranty'] || '1 Year Official Warranty').trim();

            const description = (row['description'] || `${name} details`).trim();

            const specifications = (row['specifications'] || '').trim();

            const imageUrl = (
              row['image url'] ||
              row['product photo'] ||
              row['image'] ||
              ''
            ).trim();

            if (!name) {
              return;
            }

            const price = parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0;
            const discount = parseFloat(String(rawDiscount).replace(/[^0-9.]/g, '')) || 0;
            const fallbackQty = parseInt(String(rawQuantity).replace(/[^0-9]/g, ''), 10) || 10;

            let category = null;
            if (rawCategory) {
              category = await categoryRepository.findOne({
                where: { name: rawCategory },
              });
              if (!category) {
                category = await categoryRepository.findOne({
                  where: { id: rawCategory },
                });
              }
            }

            if (!category) {
              category = await categoryRepository.findOne({
                where: {},
                order: { createdAt: 'ASC' },
              });
            }

            if (!category) {
              category = await categoryRepository.save({
                name: rawCategory || 'General',
                description: 'General category',
                hasColors: true,
                hasVariants: false,
              });
            }

            let parsedColors: Array<{ name: string; quantity: number }> = [];
            const parsedVariants: Array<{
              ram: string | null;
              storage: string | null;
              color: string | null;
              quantity: number;
            }> = [];

            if (rawColors) {
              const tokens = rawColors
                .split(/[;,|]+/)
                .map((t) => t.trim())
                .filter(Boolean);
              for (const token of tokens) {
                const parenMatch = token.match(/^(.+?)\s*\(\s*(\d+)\s*\)$/);
                const colonMatch = token.match(/^(.+?)\s*[:=]\s*(\d+)$/);
                let rawDescriptor = token;
                let qty = 10;

                if (parenMatch) {
                  rawDescriptor = parenMatch[1].trim();
                  qty = parseInt(parenMatch[2], 10) || 0;
                } else if (colonMatch) {
                  rawDescriptor = colonMatch[1].trim();
                  qty = parseInt(colonMatch[2], 10) || 0;
                }

                const memoryMatches = rawDescriptor.match(/\b\d+\s*(?:GB|TB)\b/gi) || [];
                let ram: string | null = null;
                let storage: string | null = null;
                let colorName = rawDescriptor;

                if (memoryMatches.length >= 2) {
                  ram = memoryMatches[0].trim();
                  storage = memoryMatches[1].trim();
                  colorName =
                    rawDescriptor
                      .replace(memoryMatches[0], '')
                      .replace(memoryMatches[1], '')
                      .replace(/[\/+,]/g, ' ')
                      .trim() || 'Standard';
                } else if (memoryMatches.length === 1) {
                  storage = memoryMatches[0].trim();
                  colorName =
                    rawDescriptor
                      .replace(memoryMatches[0], '')
                      .replace(/[\/+,]/g, ' ')
                      .trim() || 'Standard';
                }

                if (ram || storage) {
                  parsedVariants.push({
                    ram,
                    storage,
                    color: colorName,
                    quantity: qty,
                  });
                }

                parsedColors.push({
                  name: colorName,
                  quantity: qty,
                });
              }
            }

            const totalQuantity =
              parsedColors.length > 0
                ? parsedColors.reduce((sum, c) => sum + c.quantity, 0)
                : fallbackQty;

            if (parsedColors.length === 0) {
              parsedColors = [{ name: 'Standard', quantity: totalQuantity }];
            }

            const createDto: CreateProductDto = {
              name,
              price: String(price),
              categoryId: category.id,
              discount: String(discount),
              quantity: totalQuantity,
              quantiy: totalQuantity,
              warranty,
              description,
              specifications,
              imageUrl: imageUrl && imageUrl.startsWith('http') ? imageUrl : undefined,
              productColors: parsedColors,
              variants: parsedVariants.length > 0 ? parsedVariants : undefined,
            };

            await createProductFn(createDto);
            products.push({ name } as Partial<Product>);
          } catch (err) {
            console.error('Error processing CSV row:', err);
          } finally {
            stream.resume();
          }
        })
        .on('end', () => {
          deleteFile(filePath);
          resolve({
            status: true,
            code: 200,
            data: { message: `${products.length} products successfully imported.` },
          });
        });
    });
  }
}

import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './Repositories/Product.repo';
import { ProductColorRepository } from './Repositories/ProductColor.repo';
import { ProductDto } from './Dtos/Product.Dto';
import { CreateProductDto } from './Dtos/create-product.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { UpdateProductDto } from './Dtos/update-product.dto';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { dateToUTC, deleteFile } from 'Common/Utils/Utils';
import { createReadStream } from 'fs';
import { Product } from './Entities/Product.entity';
import { parse } from 'fast-csv';
import { CategoryRepository } from 'Modules/Category/Repositories/Category.repo';
import { ProductColor } from './Entities/ProductColor.entity';
import { AIService } from 'Modules/AI/ai.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productColorRepository: ProductColorRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly aiService: AIService,
  ) {}

  async create(productData: CreateProductDto): Promise<baseResponseDto> {
    try {
      let category = await this.categoryRepository.findOne({
        where: { id: productData.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category does not exist');
      }

      const existingProduct = await this.productRepository.findOne({
        where: { name: productData.name },
        withDeleted: true,
      });

      let quantity = 0;
      let incomingColors = productData?.productColors || productData?.colors || [];
      if (incomingColors.length) {
        incomingColors.forEach(
          (productColor: any) => (quantity += Number(productColor.quantity) || 0),
        );
      } else if (productData.quantity) {
        quantity = Number(productData.quantity) || 0;
      } else if (productData.quantiy) {
        quantity = Number(productData.quantiy) || 0;
      }

      // ✨ Server-Side AI Auto-Enrichment if fields are missing or default
      let finalDescription = productData.description;
      let finalSpecifications = productData.specifications;
      let finalWarranty = productData.warranty;
      let finalImageUrl = productData.imageUrl;
      let finalColors = incomingColors;

      if (
        !finalImageUrl ||
        !finalDescription ||
        finalDescription === `${productData.name} details` ||
        !finalWarranty ||
        !finalSpecifications
      ) {
        try {
          const aiEnriched = await this.aiService.enrichProductDetails(
            productData.name,
            category.name,
            productData.price,
          );
          if (!finalImageUrl && aiEnriched.imageUrl) {
            finalImageUrl = aiEnriched.imageUrl;
          }
          if (
            (!finalDescription || finalDescription === `${productData.name} details`) &&
            aiEnriched.description
          ) {
            finalDescription = aiEnriched.description;
          }
          if (!finalSpecifications && aiEnriched.specifications) {
            finalSpecifications = aiEnriched.specifications;
          }
          if (!finalWarranty && aiEnriched.warranty) {
            finalWarranty = aiEnriched.warranty;
          }
          if (!finalColors.length && aiEnriched.colors?.length) {
            finalColors = aiEnriched.colors as any;
            quantity = finalColors.reduce(
              (acc: number, curr: any) => acc + (Number(curr.quantity) || 0),
              0,
            );
          }
        } catch (e) {
          console.warn('Backend AI auto-enrichment warning:', e);
        }
      }

      if (existingProduct) {
        if (existingProduct.deletedAt) {
          // Restore and update soft-deleted product
          existingProduct.deletedAt = null;
          existingProduct.category = category;
          existingProduct.description = finalDescription;
          existingProduct.price = parseFloat(productData.price);
          existingProduct.discount = productData.discount ? parseFloat(productData.discount) : 0;
          existingProduct.quantity = quantity;
          existingProduct.specifications = finalSpecifications;
          existingProduct.warranty = finalWarranty;
          if (finalImageUrl !== undefined) {
            existingProduct.imageUrl = finalImageUrl;
          }
          if (finalColors.length) {
            existingProduct.colors = finalColors as any;
          }

          const restoredProduct = await this.productRepository.save(existingProduct);
          return {
            code: 201,
            status: true,
            data: {
              product: restoredProduct,
            },
          };
        }
        throw new ConflictException('Product already existed');
      }

      const productDetails: ProductDto = {
        name: productData.name,
        description: finalDescription,
        quantity: quantity,
        price: parseFloat(productData.price),
        category: category,
        specifications: finalSpecifications,
        warranty: finalWarranty,
        imageUrl: finalImageUrl || null,
        discount: productData.discount ? parseFloat(productData.discount) : 0,
        colors: finalColors.length ? (finalColors as any) : [],
      };

      const newProduct = await this.productRepository.save(productDetails);

      return {
        code: 201,
        status: true,
        data: {
          product: newProduct,
        },
      };
    } catch (error) {
      console.error('Create product error:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error?.message || 'Unable to create a new product');
    }
  }

  async update(id: string, productData: UpdateProductDto): Promise<baseResponseDto> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { id },
        relations: ['colors', 'category'],
      });
      if (!existingProduct) {
        throw new NotFoundException('Product not found!');
      }
      if (productData?.categoryId) {
        let category = await this.categoryRepository.findOne({
          where: { id: productData.categoryId },
        });

        if (!category) {
          throw new NotFoundException('Category does not exist');
        }
        existingProduct.category = category;
      }

      if (productData.name !== undefined) existingProduct.name = productData.name;
      if (productData.price !== undefined)
        existingProduct.price = parseFloat(productData.price as any);
      if (productData.discount !== undefined)
        existingProduct.discount = parseFloat(productData.discount as any);
      if (productData.description !== undefined)
        existingProduct.description = productData.description;

      const incomingUpdateColors = productData.productColors || productData.colors;
      if (incomingUpdateColors && Array.isArray(incomingUpdateColors)) {
        existingProduct.colors = incomingUpdateColors as any;
        if (incomingUpdateColors.length > 0) {
          let colorQty = 0;
          incomingUpdateColors.forEach((c: any) => (colorQty += Number(c.quantity) || 0));
          existingProduct.quantity = colorQty;
        }
      } else {
        if (productData.quantity !== undefined) {
          existingProduct.quantity = Number(productData.quantity);
        } else if (productData.quantiy !== undefined) {
          existingProduct.quantity = Number(productData.quantiy);
        }
      }

      if (productData.specifications !== undefined)
        existingProduct.specifications = productData.specifications;
      if (productData.warranty !== undefined) existingProduct.warranty = productData.warranty;
      if (productData.imageUrl !== undefined) existingProduct.imageUrl = productData.imageUrl;

      const updatedProduct = await this.productRepository.save(existingProduct);

      return {
        status: true,
        code: 200,
        data: {
          message: 'Product updated successfully',
          product: updatedProduct,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unable to update a product');
    }
  }

  async getAllWithPagination(
    page: number = 1,
    limit: number = 10,
    searchText: string = null,
  ): Promise<baseResponseDto> {
    try {
      const pageNumber = Math.max(1, page || 1);
      const limitNumber = Math.max(1, limit || 10);

      const queryBuilder = this.productRepository.createQueryBuilder('product');

      queryBuilder
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.colors', 'colors')
        .where('product.deletedAt IS NULL');

      if (searchText) {
        queryBuilder.andWhere(
          `(
                      product.name LIKE :searchText OR 
                      category.name LIKE :searchText OR
                      CAST(product.price AS TEXT) LIKE :searchText OR 
                      CAST(product.quantity AS TEXT) LIKE :searchText
                    )`,
          { searchText: `%${searchText}%` },
        );
      }

      const total = await queryBuilder.getCount();

      const products = await queryBuilder
        .orderBy('product.createdAt', 'DESC')
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getMany();

      return {
        status: true,
        code: 200,
        data: {
          products,
          total,
          page: pageNumber,
          pageSize: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unable to fetch products');
    }
  }

  async getById(id: string): Promise<baseResponseDto> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { id },
        relations: ['category', 'colors'],
      });
      if (!existingProduct) {
        throw new NotFoundException('Product does not exist');
      }
      return {
        status: true,
        code: 200,
        data: {
          data: existingProduct,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unable to get a product');
    }
  }

  async softDeleteById(id: string): Promise<baseResponseDto> {
    try {
      const existingProduct = await this.productRepository.findOneBy({ id });
      if (!existingProduct) {
        throw new NotFoundException('Product does not exist');
      }
      existingProduct.deletedAt = dateToUTC();
      await this.productRepository.save(existingProduct);
      return {
        status: true,
        code: 200,
        data: { message: 'Product deleted successfully' },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unable to delete a product');
    }
  }

  async downloadCSV(res: Response): Promise<void> {
    try {
      const products = await this.productRepository.find({
        relations: ['category', 'colors'],
      });

      if (!products.length) {
        // res.status(200).send('No Product found');
        return;
      }

      const formattedProducts = products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category?.name || '',
        price: product.price,
        discount: product.discount,
        quantity: product.quantity,
        warranty: product.warranty,
        description: product.description,
        specifications: product.specifications,
        colors: product.colors?.map((c) => `${c.name} (${c.quantity})`).join(', ') || '',
      }));

      const parser = new Parser();
      const csv = parser.parse(formattedProducts);

      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename=products.csv');
      res.status(200).send(csv); // ✅ CSV is sent here
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unable to download CSV');
    }
  }

  async uploadCSV(filePath: string): Promise<baseResponseDto> {
    const products: Partial<Product>[] = [];

    return new Promise((resolve, reject) => {
      const stream = createReadStream(filePath)
        .pipe(parse({ headers: true }))
        .on('error', (err) => {
          console.error(err);
          deleteFile(filePath); // Ensure file is deleted on error
          reject(new InternalServerErrorException('CSV parsing failed'));
        })
        .on('data', async (row) => {
          stream.pause(); // Pause stream while handling row

          try {
            const requiredKeys = [
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

            for (const key of requiredKeys) {
              if (!row[key]) {
                deleteFile(filePath);
                reject(new BadRequestException(`Missing required field: ${key}`));
                return;
              }
            }

            const {
              name,
              category,
              price,
              discount,
              quantity,
              warranty,
              description,
              specifications,
              colors,
            } = row;

            const cat = await this.categoryRepository.findOne({
              where: { name: category },
            });

            if (!cat) {
              deleteFile(filePath);
              reject(new NotFoundException(`Category "${category}" not found`));
              return;
            }

            const product = this.productRepository.create({
              name,
              price,
              discount,
              quantity: Number(quantity),
              warranty,
              description,
              specifications,
              category: cat,
            });

            const savedProduct = await this.productRepository.save(product);

            if (colors) {
              const colorList = colors.split(',').map((c: string) => {
                const match = c.trim().match(/^(.+?)\s*\((\d+)\)$/);
                return match
                  ? {
                      colorName: match[1],
                      quantity: Number(match[2]),
                      product: savedProduct,
                    }
                  : null;
              });

              const validColors = colorList.filter(Boolean) as Partial<ProductColor>[];
              await this.productColorRepository.save(validColors);
            }

            products.push(product);
          } catch (err) {
            console.error(err);
            deleteFile(filePath);
            reject(new InternalServerErrorException('Error processing row'));
          } finally {
            stream.resume();
          }
        })
        .on('end', () => {
          deleteFile(filePath); // ✅ Delete file after processing is done
          resolve({
            status: true,
            code: 200,
            data: { message: `${products.length} products imported.` },
          });
        });
    });
  }
}

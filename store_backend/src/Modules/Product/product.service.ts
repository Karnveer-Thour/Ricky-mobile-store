import {
  ConflictException,
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
import { dateToUTC } from 'Common/Utils/Utils';
import { createReadStream } from 'fs';
import { Product } from './Entities/Product.entity';
import { parse } from 'fast-csv';
import { CategoryRepository } from 'Modules/Category/Repositories/Category.repo';
import { ProductColor } from './Entities/ProductColor.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productColorRepository: ProductColorRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(productData: CreateProductDto): Promise<baseResponseDto> {
    try {
      let category = await this.categoryRepository.findOne({
        where: { name: productData.categoryName },
      });

      if (!category) {
        throw new NotFoundException('Category does not exist');
      }

      const existingProduct = await this.productRepository.findOneBy({
        name: productData.name,
        description: productData.description,
      });

      if (existingProduct) {
        throw new ConflictException('Product already existed');
      }

      let quantity = 0;
      productData.productColors.forEach((productColor) => (quantity += productColor.quantity));

      const productDetails: ProductDto = {
        name: productData.name,
        description: productData.description,
        quantiy: quantity,
        price: productData.price,
        category: category,
        specifications: productData.specifications,
        warranty: productData.warranty,
        discount: productData.discount,
      };

      const newProduct = await this.productRepository.save(productDetails);

      const newColors = await Promise.all(
        productData.productColors.map((productColor) =>
          this.productColorRepository.save({ ...productColor, product: newProduct }),
        ),
      );

      return {
        code: 201,
        status: true,
        data: {
          product: newProduct,
          productColors: newColors,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to create a new product');
    }
  }

  async update(id: string, productData: UpdateProductDto): Promise<baseResponseDto> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { id },
        relations: ['product_color'],
      });
      if (!existingProduct) {
        throw new NotFoundException('Product not found!');
      }

      if (productData.categoryName) {
        let category = await this.categoryRepository.findOne({
          where: { name: productData.categoryName },
        });

        if (!category) {
          throw new NotFoundException('Category does not exist');
        }

        existingProduct.category = category;
      }

      if (productData.productColors?.length) {
        const productColors = await Promise.all(
          productData.productColors.map(async (colorDto) => {
            const color = await this.productColorRepository.findOneBy({ id: colorDto.id });
            if (!color) {
              throw new NotFoundException(`ProductColor with id ${colorDto.id} not found`);
            }
            for (let key in color) {
              color[key] = colorDto[key] ?? color[key];
            }
            return color;
          }),
        );
        existingProduct.colors = productColors;
      }

      for (let key in existingProduct) {
        if (key === 'colors') {
          continue;
        }
        existingProduct[key] = productData[key] ?? existingProduct[key];
      }

      await this.productRepository.save(existingProduct);

      return {
        status: true,
        code: 204,
        data: {
          message: 'Product updated successfully.',
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to update a product');
    }
  }

  async getAllWithPagination(
    page: number = 1,
    limit: number = 10,
    searchText: string = null,
  ): Promise<baseResponseDto> {
    try {
      const queryBuilder = this.productRepository.createQueryBuilder('product');

      queryBuilder.where('product.deletedAt IS NULL');

      if (searchText) {
        queryBuilder.andWhere(
          `(
                      product.name ILIKE :searchText OR 
                      CAST(product.price AS TEXT) ILIKE :searchText OR 
                      product.quantity ILIKE :searchText OR 
                    )`,
          { searchText: `%${searchText}%` },
        );
      }

      const total = await queryBuilder.getCount();

      const products = await queryBuilder
        .orderBy('city.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return {
        status: true,
        code: 200,
        data: {
          products,
          total,
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to fetch products');
    }
  }

  async getById(id: string): Promise<baseResponseDto> {
    try {
      const existingProduct = await this.productRepository.findOneBy({ id });
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
      throw new InternalServerErrorException('Unable to get a product');
    }
  }

  async softDeleteById(id: string): Promise<baseResponseDto> {
    try {
      const existingProduct = await this.productRepository.findOneBy({ id });
      if (!existingProduct) {
        throw new NotFoundException('City does not exist');
      }
      existingProduct.deletedAt = dateToUTC();
      await this.productRepository.save(existingProduct);
      return {
        status: true,
        code: 200,
        data: { message: 'Product deleted successfully' },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to delete a product');
    }
  }

  async downloadCSV(res: Response): Promise<void> {
    try {
      const products = await this.productRepository.find({
        relations: ['category', 'colors'],
      });

      if (!products.length) {
        res.status(200).json({ status: true, message: 'No products found' });
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
      res.send(csv);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unable to download CSV');
    }
  }

  async uploadCSV(filePath: string): Promise<baseResponseDto> {
    try {
      const products: Partial<Product>[] = [];

      const stream = createReadStream(filePath)
        .pipe(parse({ headers: true }))
        .on('error', (err) => {
          throw new InternalServerErrorException('CSV parsing failed');
        })
        .on('data', async (row) => {
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

          // Get or create category
          let cat = await this.categoryRepository.findOne({
            where: { name: category },
          });

          if (!cat) {
            throw new NotFoundException("Category not found");
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
        });

      return new Promise((resolve, reject) => {
        stream.on('end', () => {
          resolve({
            status: true,
            code: 200,
            data: { message: `${products.length} products imported.` },
          });
        });
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unable to upload product CSV');
    }
  }
}

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
import { ProductVariantRepository } from './Repositories/ProductVariant.repo';
import { ProductDto } from './Dtos/Product.Dto';
import { CreateProductDto } from './Dtos/create-product.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { UpdateProductDto } from './Dtos/update-product.dto';
import { Response } from 'express';
import { dateToUTC } from 'Common/Utils/Utils';
import { CategoryRepository } from 'Modules/Category/Repositories/Category.repo';
import { ProductCsvService } from './Services/product-csv.service';
import { ProductEnrichmentService } from './Services/product-enrichment.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productColorRepository: ProductColorRepository,
    private readonly productVariantRepository: ProductVariantRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly productCsvService: ProductCsvService,
    private readonly productEnrichmentService: ProductEnrichmentService,
  ) {}

  async create(productData: CreateProductDto): Promise<baseResponseDto> {
    try {
      let category = await this.categoryRepository.findOne({
        where: { id: productData.categoryId },
      });

      if (!category) {
        category = await this.categoryRepository.findOne({
          where: { name: productData.categoryId },
        });
      }

      if (!category) {
        category = await this.categoryRepository.findOne({
          where: {},
          order: { createdAt: 'ASC' },
        });
      }

      if (!category) {
        category = await this.categoryRepository.save({
          name: 'General',
          description: 'General mobile and electronic items',
          hasColors: true,
          hasVariants: false,
        });
      }

      const existingProduct = await this.productRepository.findOne({
        where: { name: productData.name },
        withDeleted: true,
      });

      let quantity = 0;
      const incomingColors = productData?.productColors || productData?.colors || [];
      const incomingVariants = productData?.variants || [];

      if (incomingVariants.length) {
        incomingVariants.forEach((v: any) => (quantity += Number(v.quantity) || 0));
      } else if (incomingColors.length) {
        incomingColors.forEach(
          (productColor: any) => (quantity += Number(productColor.quantity) || 0),
        );
      } else if (productData.quantity !== undefined && productData.quantity !== null) {
        quantity = Number(productData.quantity) || 0;
      } else if (productData.quantiy !== undefined && productData.quantiy !== null) {
        quantity = Number(productData.quantiy) || 0;
      }

      const enrichment = await this.productEnrichmentService.autoEnrichProductDetails(
        productData,
        category,
        incomingColors,
      );

      if (enrichment.calculatedQuantity > 0 && quantity === 0) {
        quantity = enrichment.calculatedQuantity;
      }

      const mappedColors = this.productEnrichmentService.mapColors(enrichment.finalColors);
      const mappedVariants = this.productEnrichmentService.mapVariants(incomingVariants);

      if (existingProduct) {
        if (existingProduct.deletedAt) {
          existingProduct.deletedAt = null;
        }
        existingProduct.category = category;
        existingProduct.description = enrichment.finalDescription;
        existingProduct.price = parseFloat(productData.price);
        existingProduct.discount = productData.discount ? parseFloat(productData.discount) : 0;
        existingProduct.quantity = quantity;
        existingProduct.specifications = enrichment.finalSpecifications;
        existingProduct.warranty = enrichment.finalWarranty;
        if (enrichment.finalImageUrl !== undefined) {
          existingProduct.imageUrl = enrichment.finalImageUrl;
        }
        if (mappedColors.length) {
          existingProduct.colors = mappedColors;
        }
        if (mappedVariants.length) {
          existingProduct.variants = mappedVariants;
        }

        const updatedExisting = await this.productRepository.save(existingProduct);
        return {
          code: 201,
          status: true,
          data: {
            product: updatedExisting,
          },
        };
      }

      const productDetails: ProductDto = {
        name: productData.name,
        description: enrichment.finalDescription,
        quantity: quantity,
        price: parseFloat(productData.price),
        category: category,
        specifications: enrichment.finalSpecifications,
        warranty: enrichment.finalWarranty,
        imageUrl: enrichment.finalImageUrl || null,
        discount: productData.discount ? parseFloat(productData.discount) : 0,
        colors: mappedColors,
        variants: mappedVariants,
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
        relations: ['colors', 'variants', 'category'],
      });
      if (!existingProduct) {
        throw new NotFoundException('Product not found!');
      }
      if (productData?.categoryId) {
        const category = await this.categoryRepository.findOne({
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

      const incomingVariants = productData.variants;
      if (incomingVariants && Array.isArray(incomingVariants)) {
        await this.productVariantRepository
          .createQueryBuilder()
          .delete()
          .where('"ProductId" = :productId', { productId: existingProduct.id })
          .execute();

        if (incomingVariants.length > 0) {
          const mappedVariants = incomingVariants.map((v: any) =>
            this.productVariantRepository.create({
              ram: v.ram || null,
              storage: v.storage || null,
              color: v.color || null,
              quantity: Number(v.quantity) || 0,
              product: existingProduct,
            }),
          );
          existingProduct.variants = mappedVariants;
          let variantQty = 0;
          incomingVariants.forEach((v: any) => (variantQty += Number(v.quantity) || 0));
          existingProduct.quantity = variantQty;
        } else {
          existingProduct.variants = [];
        }
      }

      const incomingUpdateColors = productData.productColors || productData.colors;
      if (incomingUpdateColors && Array.isArray(incomingUpdateColors)) {
        if (incomingUpdateColors.length > 0) {
          const mappedColors = incomingUpdateColors.map((c: any) =>
            this.productColorRepository.create({
              name: c.name,
              quantity: Number(c.quantity) || 0,
              product: existingProduct,
            }),
          );
          existingProduct.colors = mappedColors;
          if (!incomingVariants || !incomingVariants.length) {
            let colorQty = 0;
            incomingUpdateColors.forEach((c: any) => (colorQty += Number(c.quantity) || 0));
            existingProduct.quantity = colorQty;
          }
        } else {
          await this.productColorRepository.delete({
            product: { id: existingProduct.id },
          });
          existingProduct.colors = [];
          if (
            (!incomingVariants || !incomingVariants.length) &&
            productData.quantity !== undefined &&
            productData.quantity !== null
          ) {
            existingProduct.quantity = Number(productData.quantity);
          } else if (
            (!incomingVariants || !incomingVariants.length) &&
            productData.quantiy !== undefined &&
            productData.quantiy !== null
          ) {
            existingProduct.quantity = Number(productData.quantiy);
          }
        }
      } else if (!incomingVariants || !incomingVariants.length) {
        if (productData.quantity !== undefined && productData.quantity !== null) {
          existingProduct.quantity = Number(productData.quantity);
        } else if (productData.quantiy !== undefined && productData.quantiy !== null) {
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
        .leftJoinAndSelect('product.variants', 'variants')
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
        relations: ['category', 'colors', 'variants'],
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
        where: { deletedAt: null as any },
        relations: ['category', 'colors', 'variants'],
      });

      return this.productCsvService.downloadCSV(products, res);
    } catch (error) {
      console.error('Backend downloadCSV error:', error);
      if (!res.headersSent) {
        res.status(500).json({ status: false, message: 'Unable to download CSV' });
      }
    }
  }

  async uploadCSV(filePath: string): Promise<baseResponseDto> {
    return this.productCsvService.uploadCSV(filePath, this.categoryRepository, (dto) =>
      this.create(dto),
    );
  }
}

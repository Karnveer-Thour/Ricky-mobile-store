import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProductReviewRepository } from './Repositories/ProductReview.repo';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { CreateProductReview } from './Dtos/create-product-review.dto';
import { ProductReview } from './Dtos/ProductReview.dto';
import { UpdateProductReview } from './Dtos/update-product-review.dto';
import { dateToUTC } from 'Common/Utils/Utils';

@Injectable()
export class ProductReviewService {
  constructor(
    private readonly productReviewRepository: ProductReviewRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async create(productReviewData: CreateProductReview): Promise<baseResponseDto> {
    try {
      const [user, product] = await Promise.all([
        await this.userRepository.findOneBy({ id: productReviewData.reviewedById }),
        await this.productRepository.findOneBy({ id: productReviewData.reviewedProductId }),
      ]);
      if (!user) {
        throw new NotFoundException('User not existed');
      }
      if (!product) {
        throw new NotFoundException('Product not existed');
      }

      const productReview: ProductReview = {
        title: productReviewData.title,
        description: productReviewData?.description ?? '',
        reviewedBy: user,
        reviewedProduct: product,
      };

      const newProductReview = await this.productReviewRepository.save(productReview);

      return {
        code: 201,
        status: true,
        data: {
          message: 'Review uploaded successfully!',
          productReview: newProductReview,
        },
      };
    } catch (error) {
      console.error('Problem in create product review is---->', error);
      throw new InternalServerErrorException('Unable to create product review');
    }
  }

  async update(id: string, productReviewData: UpdateProductReview): Promise<baseResponseDto> {
    try {
      const existingProductReview = await this.productReviewRepository.findOneBy({ id });
      if (!existingProductReview) {
        throw new NotFoundException('Product Review does not found!');
      }
      for (let key in existingProductReview) {
        existingProductReview[key] = productReviewData[key] ?? existingProductReview[key];
      }
      await this.productReviewRepository.save(existingProductReview);
      return {
        code: 204,
        status: true,
        data: {
          message: 'Review updated successfully!',
        },
      };
    } catch (error) {
      console.error('Problem in update product review is---->', error);
      throw new InternalServerErrorException('Unable to update product review');
    }
  }

  async getAll(page: number, limit: number): Promise<baseResponseDto> {
    try {
      const query = this.productReviewRepository
        .createQueryBuilder('p_reviews')
        .leftJoinAndSelect('p_reviews.reviewedBy', 'reviewedBy')
        .leftJoinAndSelect('p_reviews.reviewedProduct', 'reviewedProduct')
        .where('p_reviews.deletedAt is NULL');
      query.skip(page - 1).take(limit);
      const [productReviews, total] = await query.getManyAndCount();
      return {
        status: true,
        code: 200,
        data: {
          productReviews,
          total,
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Problem in fetching product reviews is---->', error);
      throw new InternalServerErrorException('Unable to fetch product reviews');
    }
  }

  async softDeleteById(id: string): Promise<baseResponseDto> {
    try {
      const existingProductReview = await this.productReviewRepository.findOneBy({ id });
      if (!existingProductReview) {
        throw new NotFoundException('Product Review does not found!');
      }
      existingProductReview.deletedAt = dateToUTC();
      return {
        status: true,
        code: 204,
        data: { message: 'Product Review deleted successfully' },
      };
    } catch (error) {
      console.error('Problem in deleting product review is---->', error);
      throw new InternalServerErrorException('Unable to delet product review');
    }
  }
}

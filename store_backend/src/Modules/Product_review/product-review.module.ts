import { Module } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { ProductReviewController } from './product-review.controller';
import { ProductReviewRepository } from './Repositories/ProductReview.repo';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';

@Module({
  controllers: [ProductReviewController],
  providers: [ProductReviewService,ProductReviewRepository,UserRepository,ProductRepository],
})
export class ProductReviewModule {}

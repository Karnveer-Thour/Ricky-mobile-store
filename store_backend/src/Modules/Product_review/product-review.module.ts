import { Module } from '@nestjs/common';
import { ProductReviewRepository } from './Repositories/ProductReview.repo';

@Module({
  providers: [ProductReviewRepository],
})
export class ProductReviewModule {}

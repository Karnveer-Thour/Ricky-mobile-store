import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './Repositories/Product.repo';
import { ProductColorRepository } from './Repositories/ProductColor.repo';
import { ProductVariantRepository } from './Repositories/ProductVariant.repo';
import { CategoryRepository } from 'Modules/Category/Repositories/Category.repo';
import { AIModule } from 'Modules/AI/ai.module';

@Module({
  imports: [AIModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    ProductColorRepository,
    ProductVariantRepository,
    CategoryRepository,
  ],
})
export class ProductModule {}

import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './Repositories/Product.repo';
import { ProductColorRepository } from './Repositories/ProductColor.repo';
import { CategoryRepository } from 'Modules/Category/Repositories/Category.repo';

@Module({
  controllers: [ProductController],
  providers: [ProductService,ProductRepository,ProductColorRepository,CategoryRepository],
})
export class ProductModule {}

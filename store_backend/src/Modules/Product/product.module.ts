import { Module } from '@nestjs/common';
import { ProductRepository } from './Repositories/Product.repo';
import { ProductColorRepository } from './Repositories/ProductColor.repo';

@Module({
  providers: [ProductRepository, ProductColorRepository],
})
export class ProductModule {}

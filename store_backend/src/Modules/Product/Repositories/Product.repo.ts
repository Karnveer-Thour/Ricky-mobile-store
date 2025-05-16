import { BaseRepository } from 'Common/Repositories/Base.repo';
import { Product } from '../Entities/Product.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(private readonly dataSource: DataSource) {
    super(Product, dataSource);
  }
}

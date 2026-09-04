import { BaseRepository } from 'Common/Repositories/Base.repo';
import { ProductVariant } from '../Entities/ProductVariant.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductVariantRepository extends BaseRepository<ProductVariant> {
  constructor(private readonly dataSource: DataSource) {
    super(ProductVariant, dataSource);
  }
}

import { BaseRepository } from 'Common/Repositories/Base.repo';
import { ProductColor } from '../Entities/ProductColor.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductColorRepository extends BaseRepository<ProductColor> {
  constructor(private readonly dataSource: DataSource) {
    super(ProductColor, dataSource);
  }
}

import { BaseRepository } from 'Common/Repositories/Base.repo';
import { SaleItem } from '../Entities/SaleItem.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SaleItemRepository extends BaseRepository<SaleItem> {
  constructor(private readonly dataSource: DataSource) {
    super(SaleItem, dataSource);
  }
}

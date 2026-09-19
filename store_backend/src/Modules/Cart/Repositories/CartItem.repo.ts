import { BaseRepository } from 'Common/Repositories/Base.repo';
import { CartItem } from '../Entities/CartItem.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CartItemRepository extends BaseRepository<CartItem> {
  constructor(private readonly dataSource: DataSource) {
    super(CartItem, dataSource);
  }
}

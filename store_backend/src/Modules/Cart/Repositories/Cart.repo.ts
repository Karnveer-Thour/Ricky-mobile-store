import { BaseRepository } from 'Common/Repositories/Base.repo';
import { Cart } from '../Entities/Cart.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CartRepository extends BaseRepository<Cart> {
  constructor(private readonly dataSource: DataSource) {
    super(Cart, dataSource);
  }
}

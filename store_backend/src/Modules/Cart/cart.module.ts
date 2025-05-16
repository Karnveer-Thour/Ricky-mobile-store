import { Module } from '@nestjs/common';
import { CartRepository } from './Repositories/Cart.repo';

@Module({
  providers: [CartRepository],
})
export class CartModule {}

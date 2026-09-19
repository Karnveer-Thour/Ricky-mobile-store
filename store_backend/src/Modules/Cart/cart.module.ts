import { Module } from '@nestjs/common';
import { CartRepository } from './Repositories/Cart.repo';
import { CartItemRepository } from './Repositories/CartItem.repo';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';
import { ProductColorRepository } from 'Modules/Product/Repositories/ProductColor.repo';

@Module({
  controllers: [CartController],
  providers: [
    CartRepository,
    CartItemRepository,
    CartService,
    UserRepository,
    ProductRepository,
    ProductColorRepository,
  ],
  exports: [CartService, CartRepository],
})
export class CartModule {}

import { Module } from '@nestjs/common';
import { WishlistRepository } from './Repositories/Wishlist.repo';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';

@Module({
  controllers: [WishlistController],
  providers: [
    WishlistRepository,
    WishlistService,
    UserRepository,
    ProductRepository,
  ],
  exports: [WishlistService, WishlistRepository],
})
export class WishlistModule {}

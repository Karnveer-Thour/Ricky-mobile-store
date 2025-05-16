import { Module } from '@nestjs/common';
import { WishlistRepository } from './Repositories/Wishlist.repo';

@Module({
    providers:[WishlistRepository],
})
export class WishlistModule {}

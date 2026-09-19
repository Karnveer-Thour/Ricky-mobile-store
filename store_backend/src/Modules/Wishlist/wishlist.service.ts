import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { WishlistRepository } from './Repositories/Wishlist.repo';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepo: WishlistRepository,
    private readonly userRepo: UserRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async getOrCreateWishlist(userId: string) {
    let wishlist = await this.wishlistRepo.findOne({
      where: { wisher: { id: userId } },
      relations: ['products', 'wisher'],
    });

    if (!wishlist) {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      wishlist = this.wishlistRepo.create({
        wisher: user,
        name: 'My Wishlist',
        products: [],
      });
      await this.wishlistRepo.save(wishlist);
    }

    return wishlist;
  }

  async getWishlist(userId: string): Promise<baseResponseDto> {
    try {
      const wishlist = await this.getOrCreateWishlist(userId);
      const products = (wishlist.products || []).map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price || 0),
        discount: Number(p.discount || 0),
        effectivePrice: Number(p.price || 0) - Number(p.discount || 0),
        image: p.imageUrl || null,
        specifications: p.specifications || '',
      }));

      const productIds = products.map((p) => p.id);

      return {
        status: true,
        code: 200,
        data: {
          wishlistId: wishlist.id,
          productIds,
          products,
          count: products.length,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch wishlist');
    }
  }

  async toggleWishlist(userId: string, productId: string): Promise<baseResponseDto> {
    try {
      const wishlist = await this.getOrCreateWishlist(userId);
      const isAlreadyWishlisted = (wishlist.products || []).some(
        (p) => p.id === productId,
      );

      if (isAlreadyWishlisted) {
        wishlist.products = (wishlist.products || []).filter(
          (p) => p.id !== productId,
        );
        await this.wishlistRepo.save(wishlist);
        return {
          status: true,
          code: 200,
          data: {
            isWishlisted: false,
            message: 'Product removed from wishlist',
          },
        };
      } else {
        const product = await this.productRepo.findOneBy({ id: productId });
        if (!product) {
          throw new NotFoundException('Product not found');
        }
        wishlist.products = [...(wishlist.products || []), product];
        await this.wishlistRepo.save(wishlist);
        return {
          status: true,
          code: 201,
          data: {
            isWishlisted: true,
            message: 'Product added to wishlist',
          },
        };
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to toggle wishlist');
    }
  }

  async addToWishlist(userId: string, productId: string): Promise<baseResponseDto> {
    try {
      const wishlist = await this.getOrCreateWishlist(userId);
      const isAlreadyWishlisted = (wishlist.products || []).some(
        (p) => p.id === productId,
      );

      if (!isAlreadyWishlisted) {
        const product = await this.productRepo.findOneBy({ id: productId });
        if (!product) {
          throw new NotFoundException('Product not found');
        }
        wishlist.products = [...(wishlist.products || []), product];
        await this.wishlistRepo.save(wishlist);
      }

      return {
        status: true,
        code: 200,
        data: {
          isWishlisted: true,
          message: 'Product added to wishlist',
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to add to wishlist');
    }
  }

  async removeFromWishlist(userId: string, productId: string): Promise<baseResponseDto> {
    try {
      const wishlist = await this.getOrCreateWishlist(userId);
      wishlist.products = (wishlist.products || []).filter(
        (p) => p.id !== productId,
      );
      await this.wishlistRepo.save(wishlist);

      return {
        status: true,
        code: 200,
        data: {
          isWishlisted: false,
          message: 'Product removed from wishlist',
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to remove from wishlist');
    }
  }
}

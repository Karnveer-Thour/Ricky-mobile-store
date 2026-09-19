import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CartRepository } from './Repositories/Cart.repo';
import { CartItemRepository } from './Repositories/CartItem.repo';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';
import { ProductColorRepository } from 'Modules/Product/Repositories/ProductColor.repo';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly cartItemRepo: CartItemRepository,
    private readonly userRepo: UserRepository,
    private readonly productRepo: ProductRepository,
    private readonly productColorRepo: ProductColorRepository,
  ) {}

  async getOrCreateCart(userId: string) {
    let cart = await this.cartRepo.findOne({
      where: { cartOwner: { id: userId } },
      relations: ['items', 'items.product', 'items.selectedColor', 'cartOwner'],
    });

    if (!cart) {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      cart = this.cartRepo.create({
        cartOwner: user,
        items: [],
      });
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  async getCart(userId: string): Promise<baseResponseDto> {
    try {
      const cart = await this.getOrCreateCart(userId);
      const items = (cart.items || []).map((item) => {
        const product = item.product;
        const effectivePrice = product
          ? Number(product.price || 0) - Number(product.discount || 0)
          : 0;
        return {
          id: item.id,
          productId: product?.id,
          name: product?.name,
          price: Number(product?.price || 0),
          discount: Number(product?.discount || 0),
          effectivePrice,
          image: product?.imageUrl || null,
          quantity: item.quantity,
          colorId: item.selectedColor?.id || null,
          colorName: item.selectedColor?.name || 'Default',
          colorHex: '#000000',
        };
      });

      const total = items.reduce(
        (sum, item) => sum + item.effectivePrice * item.quantity,
        0,
      );

      return {
        status: true,
        code: 200,
        data: {
          cartId: cart.id,
          items,
          count: items.reduce((sum, item) => sum + item.quantity, 0),
          total,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch cart');
    }
  }

  async addToCart(
    userId: string,
    productId: string,
    colorId?: string,
    quantity: number = 1,
  ): Promise<baseResponseDto> {
    try {
      const isUUID = (str?: string) =>
        !!str &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          str,
        );

      if (!isUUID(productId)) {
        throw new NotFoundException(`Product with ID "${productId}" not found`);
      }

      const cart = await this.getOrCreateCart(userId);
      const product = await this.productRepo.findOneBy({ id: productId });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      let selectedColor = null;
      if (colorId && isUUID(colorId)) {
        selectedColor = await this.productColorRepo.findOneBy({ id: colorId });
      }

      // Check if product already exists in cart with matching color
      const existingItem = (cart.items || []).find((item) => {
        const productMatch = item.product?.id === productId;
        const colorMatch =
          (!item.selectedColor && !selectedColor) ||
          item.selectedColor?.id === selectedColor?.id;
        return productMatch && colorMatch;
      });

      let savedId: string;
      if (existingItem) {
        existingItem.quantity += quantity;
        const saved = await this.cartItemRepo.save(existingItem);
        savedId = saved.id;
      } else {
        const newItem = this.cartItemRepo.create({
          cart,
          product,
          selectedColor,
          quantity: Math.max(1, quantity),
        });
        const saved = await this.cartItemRepo.save(newItem);
        savedId = saved.id;
      }

      return {
        status: true,
        code: 201,
        data: {
          id: savedId,
          message: 'Product added to cart successfully',
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to add product to cart',
      );
    }
  }

  async updateCartItemQty(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<baseResponseDto> {
    try {
      const item = await this.cartItemRepo.findOne({
        where: { id: itemId },
        relations: ['cart', 'cart.cartOwner'],
      });

      if (!item) {
        throw new NotFoundException('Cart item not found');
      }

      if (item.cart?.cartOwner?.id !== userId) {
        throw new BadRequestException('Unauthorized cart access');
      }

      if (quantity <= 0) {
        await this.cartItemRepo.remove(item);
        return {
          status: true,
          code: 200,
          data: { message: 'Item removed from cart' },
        };
      }

      item.quantity = quantity;
      await this.cartItemRepo.save(item);

      return {
        status: true,
        code: 200,
        data: { message: 'Cart quantity updated' },
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update cart item quantity');
    }
  }

  async removeCartItem(userId: string, itemId: string): Promise<baseResponseDto> {
    try {
      const item = await this.cartItemRepo.findOne({
        where: { id: itemId },
        relations: ['cart', 'cart.cartOwner'],
      });

      if (!item) {
        throw new NotFoundException('Cart item not found');
      }

      if (item.cart?.cartOwner?.id !== userId) {
        throw new BadRequestException('Unauthorized cart access');
      }

      await this.cartItemRepo.remove(item);

      return {
        status: true,
        code: 200,
        data: { message: 'Item removed from cart' },
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove cart item');
    }
  }

  async clearCart(userId: string): Promise<baseResponseDto> {
    try {
      const cart = await this.cartRepo.findOne({
        where: { cartOwner: { id: userId } },
        relations: ['items'],
      });

      if (cart && cart.items && cart.items.length > 0) {
        await this.cartItemRepo.remove(cart.items);
      }

      return {
        status: true,
        code: 200,
        data: { message: 'Cart cleared successfully' },
      };
    } catch {
      throw new InternalServerErrorException('Failed to clear cart');
    }
  }
}

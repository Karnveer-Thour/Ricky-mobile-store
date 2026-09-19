import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { Public } from 'Common/Decorators/public.decorator';

import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  colorId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity?: number;

  @IsOptional()
  @IsString()
  userId?: string;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsString()
  userId?: string;
}

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private extractUserId(authHeader?: string, explicitUserId?: string): string {
    if (explicitUserId) return explicitUserId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          if (payload.userId) return payload.userId;
        }
      } catch {
        // ignore decoding errors
      }
    }
    throw new BadRequestException('User ID is required. Please login or provide userId.');
  }

  @Public()
  @Get()
  @ApiOperation({ summary: "Get user's cart" })
  async getCart(
    @Headers('authorization') authHeader?: string,
    @Query('userId') userId?: string,
  ): Promise<baseResponseDto> {
    const resolvedUserId = this.extractUserId(authHeader, userId);
    return this.cartService.getCart(resolvedUserId);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Add product to cart' })
  async addToCart(
    @Body() dto: AddToCartDto,
    @Headers('authorization') authHeader?: string,
  ): Promise<baseResponseDto> {
    const resolvedUserId = this.extractUserId(authHeader, dto.userId);
    return this.cartService.addToCart(
      resolvedUserId,
      dto.productId,
      dto.colorId,
      dto.quantity || 1,
    );
  }

  @Public()
  @Patch('item/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateCartItem(
    @Param('id') itemId: string,
    @Body() dto: UpdateCartItemDto,
    @Headers('authorization') authHeader?: string,
  ): Promise<baseResponseDto> {
    const resolvedUserId = this.extractUserId(authHeader, dto.userId);
    return this.cartService.updateCartItemQty(resolvedUserId, itemId, dto.quantity);
  }

  @Public()
  @Delete('item/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeCartItem(
    @Param('id') itemId: string,
    @Headers('authorization') authHeader?: string,
    @Query('userId') userId?: string,
  ): Promise<baseResponseDto> {
    const resolvedUserId = this.extractUserId(authHeader, userId);
    return this.cartService.removeCartItem(resolvedUserId, itemId);
  }

  @Public()
  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(
    @Headers('authorization') authHeader?: string,
    @Query('userId') userId?: string,
  ): Promise<baseResponseDto> {
    const resolvedUserId = this.extractUserId(authHeader, userId);
    return this.cartService.clearCart(resolvedUserId);
  }
}

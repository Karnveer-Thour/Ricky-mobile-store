import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { Public } from 'Common/Decorators/public.decorator';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

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
        // ignore decoding error
      }
    }
    throw new BadRequestException('User ID is required. Please login or provide userId.');
  }

  @Public()
  @Get()
  @ApiOperation({ summary: "Get user's wishlist" })
  async getWishlist(
    @Headers('authorization') authHeader?: string,
    @Query('userId') userId?: string,
  ): Promise<baseResponseDto> {
    const resolvedUserId = this.extractUserId(authHeader, userId);
    return this.wishlistService.getWishlist(resolvedUserId);
  }

  @Public()
  @Post(':productId')
  @ApiOperation({ summary: 'Toggle or add product to wishlist' })
  async toggleWishlist(
    @Param('productId') productId: string,
    @Headers('authorization') authHeader?: string,
    @Query('userId') userId?: string,
  ): Promise<baseResponseDto> {
    const resolvedUserId = this.extractUserId(authHeader, userId);
    return this.wishlistService.toggleWishlist(resolvedUserId, productId);
  }

  @Public()
  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  async removeFromWishlist(
    @Param('productId') productId: string,
    @Headers('authorization') authHeader?: string,
    @Query('userId') userId?: string,
  ): Promise<baseResponseDto> {
    const resolvedUserId = this.extractUserId(authHeader, userId);
    return this.wishlistService.removeFromWishlist(resolvedUserId, productId);
  }
}

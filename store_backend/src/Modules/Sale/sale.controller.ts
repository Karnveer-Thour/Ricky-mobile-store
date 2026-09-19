import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { SaleService, CreateOrderDto } from './sale.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { Public } from 'Common/Decorators/public.decorator';

import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLocationDto {
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  lng: number;
}

export class UpdateStatusDto {
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  otp?: string;
}

@ApiTags('Orders')
@Controller('orders')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

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
        // ignore
      }
    }
    throw new BadRequestException('User ID is required. Please login or provide buyerId.');
  }

  @Public()
  @Post('checkout')
  @ApiOperation({ summary: 'Place order / checkout' })
  async checkout(
    @Body() dto: CreateOrderDto,
    @Headers('authorization') authHeader?: string,
  ): Promise<baseResponseDto> {
    const buyerId = this.extractUserId(authHeader, dto.buyerId);
    return this.saleService.createOrder(buyerId, dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: "Get user's order history" })
  async getUserOrders(
    @Headers('authorization') authHeader?: string,
    @Query('userId') userId?: string,
  ): Promise<baseResponseDto> {
    const buyerId = this.extractUserId(authHeader, userId);
    return this.saleService.getUserOrders(buyerId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  async getOrderById(@Param('id') id: string): Promise<baseResponseDto> {
    return this.saleService.getOrderById(id);
  }

  @Get(':id/location')
  async getRiderLocation(@Param('id') id: string) {
    return this.saleService.getRiderLocation(id);
  }

  @Patch(':id/location')
  @HttpCode(HttpStatus.OK)
  async updateRiderLocation(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.saleService.updateRiderLocation(id, dto.lat, dto.lng);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.saleService.updateOrderStatus(id, dto.status, dto.otp);
  }
}

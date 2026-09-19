import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SaleRepository } from './Repositories/Sale.repo';
import { SaleItemRepository } from './Repositories/SaleItem.repo';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';
import { ProductColorRepository } from 'Modules/Product/Repositories/ProductColor.repo';
import { AppGateway } from 'Core/Gateways/app.gateway';
import { dateToUTC } from 'Common/Utils/Utils';
import { status } from './Model/Status.enum';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';

import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  colorId?: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discount?: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  buyerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  lender?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tenureMonths?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  monthlyInstallment?: number;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @IsString()
  deliveryOtp?: string;

  @IsOptional()
  @IsString()
  payMethod?: string;
}

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepo: SaleRepository,
    private readonly saleItemRepo: SaleItemRepository,
    private readonly userRepo: UserRepository,
    private readonly productRepo: ProductRepository,
    private readonly productColorRepo: ProductColorRepository,
    private readonly appGateway: AppGateway,
  ) {}

  async createOrder(buyerId: string, dto: CreateOrderDto): Promise<baseResponseDto> {
    try {
      if (!dto.items || dto.items.length === 0) {
        throw new BadRequestException('Order must contain at least one item');
      }

      const buyer = await this.userRepo.findOneBy({ id: buyerId });
      if (!buyer) {
        throw new NotFoundException('Buyer user not found');
      }

      // Initial Khanna delivery rider coordinates
      const KHANNA_LAT = 30.7046;
      const KHANNA_LNG = 76.2163;

      const sale = this.saleRepo.create({
        buyer,
        status: status.PENDING,
        lender: dto.lender || 'Full Payment',
        tenureMonths: dto.tenureMonths || 0,
        monthlyInstallment: dto.monthlyInstallment || 0,
        deliveryOtp: dto.deliveryOtp || '1234',
        landmark: dto.landmark || '',
        riderLat: KHANNA_LAT,
        riderLng: KHANNA_LNG,
        riderLocationUpdatedAt: dateToUTC(),
        products: [],
      });

      const savedSale = await this.saleRepo.save(sale);

      const saleItems = [];
      let totalAmount = 0;

      for (const itemDto of dto.items) {
        const product = await this.productRepo.findOneBy({ id: itemDto.productId });
        if (!product) {
          continue;
        }

        let selectedColor = null;
        if (itemDto.colorId) {
          selectedColor = await this.productColorRepo.findOneBy({ id: itemDto.colorId });
        }

        const price = Number(product.price || 0);
        const discount = Number(product.discount || 0);
        const qty = Math.max(1, itemDto.quantity || 1);

        const saleItem = this.saleItemRepo.create({
          sale: savedSale,
          product,
          selectedColor,
          quantity: qty,
          purchasedPrice: price,
          purchasedDiscount: discount,
        });

        const savedItem = await this.saleItemRepo.save(saleItem);
        saleItems.push(savedItem);
        totalAmount += (price - discount) * qty;
      }

      savedSale.products = saleItems;

      // Notify WebSocket listeners
      try {
        this.appGateway.server?.emit('order:created', {
          orderId: savedSale.id,
          total: totalAmount,
          status: savedSale.status,
          buyer: {
            id: buyer.id,
            name: `${buyer.firstName} ${buyer.lastName}`.trim(),
          },
        });
      } catch {
        // non-blocking
      }

      return {
        status: true,
        code: 201,
        data: {
          orderId: savedSale.id,
          status: savedSale.status,
          total: totalAmount,
          deliveryOtp: savedSale.deliveryOtp,
          itemCount: saleItems.length,
          message: 'Order placed successfully',
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Order creation error:', error);
      throw new InternalServerErrorException('Failed to place order');
    }
  }

  async getUserOrders(buyerId: string): Promise<baseResponseDto> {
    try {
      const sales = await this.saleRepo.find({
        where: { buyer: { id: buyerId } },
        relations: ['products', 'products.product', 'products.selectedColor'],
        order: { createdAt: 'DESC' },
      });

      const transformed = sales.map((sale) => {
        const items = (sale.products || []).map((item) => {
          const p = item.product;
          return {
            id: item.id,
            productId: p?.id,
            name: p?.name || 'Product',
            price: Number(item.purchasedPrice || 0),
            discount: Number(item.purchasedDiscount || 0),
            effectivePrice: Number(item.purchasedPrice || 0) - Number(item.purchasedDiscount || 0),
            quantity: item.quantity,
            colorName: item.selectedColor?.name || 'Default',
            image: p?.imageUrl || null,
          };
        });

        const total = items.reduce(
          (sum, i) => sum + i.effectivePrice * i.quantity,
          0,
        );

        return {
          id: sale.id,
          status: sale.status,
          lender: sale.lender,
          tenureMonths: sale.tenureMonths,
          monthlyInstallment: sale.monthlyInstallment,
          deliveryOtp: sale.deliveryOtp,
          landmark: sale.landmark,
          riderLat: sale.riderLat ? parseFloat(sale.riderLat as any) : null,
          riderLng: sale.riderLng ? parseFloat(sale.riderLng as any) : null,
          total,
          itemCount: items.length,
          items,
          createdAt: sale.createdAt,
        };
      });

      return {
        status: true,
        code: 200,
        data: {
          orders: transformed,
          count: transformed.length,
        },
      };
    } catch (error) {
      console.error('Fetch user orders error:', error);
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  async getOrderById(orderId: string): Promise<baseResponseDto> {
    try {
      const sale = await this.saleRepo.findOne({
        where: { id: orderId },
        relations: ['buyer', 'products', 'products.product', 'products.selectedColor'],
      });

      if (!sale) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      const items = (sale.products || []).map((item) => {
        const p = item.product;
        return {
          id: item.id,
          productId: p?.id,
          name: p?.name || 'Product',
          price: Number(item.purchasedPrice || 0),
          discount: Number(item.purchasedDiscount || 0),
          effectivePrice: Number(item.purchasedPrice || 0) - Number(item.purchasedDiscount || 0),
          quantity: item.quantity,
          colorName: item.selectedColor?.name || 'Default',
          image: p?.imageUrl || null,
        };
      });

      const total = items.reduce(
        (sum, i) => sum + i.effectivePrice * i.quantity,
        0,
      );

      return {
        status: true,
        code: 200,
        data: {
          id: sale.id,
          status: sale.status,
          lender: sale.lender,
          tenureMonths: sale.tenureMonths,
          monthlyInstallment: sale.monthlyInstallment,
          deliveryOtp: sale.deliveryOtp,
          landmark: sale.landmark,
          riderLat: sale.riderLat ? parseFloat(sale.riderLat as any) : null,
          riderLng: sale.riderLng ? parseFloat(sale.riderLng as any) : null,
          riderLocationUpdatedAt: sale.riderLocationUpdatedAt,
          buyer: {
            id: sale.buyer?.id,
            name: `${sale.buyer?.firstName || ''} ${sale.buyer?.lastName || ''}`.trim(),
            email: sale.buyer?.email,
            mobileNumber: sale.buyer?.mobileNumber,
          },
          items,
          total,
          createdAt: sale.createdAt,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch order details');
    }
  }

  async getRiderLocation(orderId: string) {
    const sale = await this.saleRepo.findOne({ where: { id: orderId } });
    if (!sale) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return {
      lat: sale.riderLat ? parseFloat(sale.riderLat as any) : null,
      lng: sale.riderLng ? parseFloat(sale.riderLng as any) : null,
      updatedAt: sale.riderLocationUpdatedAt || null,
    };
  }

  async updateRiderLocation(orderId: string, lat: number, lng: number) {
    const sale = await this.saleRepo.findOne({ where: { id: orderId } });
    if (!sale) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    sale.riderLat = lat;
    sale.riderLng = lng;
    sale.riderLocationUpdatedAt = dateToUTC();

    await this.saleRepo.save(sale);

    // Stream the new rider location to the tracking map using WebSockets
    this.appGateway.server?.emit(`order:${orderId}:location`, {
      lat,
      lng,
      updatedAt: sale.riderLocationUpdatedAt,
    });

    return { success: true };
  }

  async updateOrderStatus(orderId: string, newStatus: string, otp?: string) {
    const sale = await this.saleRepo.findOne({ where: { id: orderId } });
    if (!sale) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const upperStatus = newStatus.toUpperCase();

    // Map status string to enum
    if (!Object.values(status).includes(upperStatus as status)) {
      throw new BadRequestException(`Invalid order status: ${newStatus}`);
    }

    // OTP Handover verification check
    if (upperStatus === status.DELIVERED) {
      const expectedOtp = sale.deliveryOtp || '1234';
      if (!otp || otp !== expectedOtp) {
        throw new ForbiddenException('Invalid delivery Handover OTP.');
      }
    }

    sale.status = upperStatus as status;
    sale.updatedAt = dateToUTC();

    await this.saleRepo.save(sale);

    // Emit live WebSocket update to client maps & admin dashboards
    this.appGateway.emitOrderStatusChanged(orderId, sale.status);

    return { success: true };
  }
}

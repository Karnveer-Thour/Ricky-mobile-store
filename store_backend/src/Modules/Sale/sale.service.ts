import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { SaleRepository } from './Repositories/Sale.repo';
import { AppGateway } from 'Core/Gateways/app.gateway';
import { dateToUTC } from 'Common/Utils/Utils';
import { status } from './Model/Status.enum';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepo: SaleRepository,
    private readonly appGateway: AppGateway,
  ) {}

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
      // Bajaj Finserv/Home Credit OTP handover check
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

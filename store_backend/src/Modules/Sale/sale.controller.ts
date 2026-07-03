import { Controller, Get, Patch, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SaleService } from './sale.service';

export class UpdateLocationDto {
  lat: number;
  lng: number;
}

export class UpdateStatusDto {
  status: string;
  otp?: string;
}

@Controller('orders')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get(':id/location')
  async getRiderLocation(@Param('id') id: string) {
    return this.saleService.getRiderLocation(id);
  }

  @Patch(':id/location')
  @HttpCode(HttpStatus.OK)
  async updateRiderLocation(
    @Param('id') id: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.saleService.updateRiderLocation(id, dto.lat, dto.lng);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.saleService.updateOrderStatus(id, dto.status, dto.otp);
  }
}

import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { SaleRepository } from './Repositories/Sale.repo';

@Module({
  controllers: [SaleController],
  providers: [SaleService,SaleRepository],
})
export class SaleModule {}

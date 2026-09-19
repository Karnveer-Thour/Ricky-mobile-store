import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { SaleRepository } from './Repositories/Sale.repo';
import { SaleItemRepository } from './Repositories/SaleItem.repo';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';
import { ProductColorRepository } from 'Modules/Product/Repositories/ProductColor.repo';

@Module({
  controllers: [SaleController],
  providers: [
    SaleService,
    SaleRepository,
    SaleItemRepository,
    UserRepository,
    ProductRepository,
    ProductColorRepository,
  ],
  exports: [SaleService, SaleRepository],
})
export class SaleModule {}

import { Module } from '@nestjs/common';
import { SaleRepository } from './Repositories/Sale.repo';

@Module({
    providers:[SaleRepository]
})
export class SaleModule {}
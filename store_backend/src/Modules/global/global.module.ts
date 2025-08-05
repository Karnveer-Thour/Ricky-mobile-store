import { Module } from '@nestjs/common';
import { GlobalService } from './global.service';
import { GlobalController } from './global.controller';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';
import { AcceptedCitiesRepository } from 'Modules/Accepted_cities/Repositories/accepted-cities.Repo';
import { CategoryRepository } from 'Modules/Category/Repositories/Category.repo';
import { whatsappDetailsRepository } from 'Modules/Whatsapp_details/Repositories/WhatsappDetails.repo';
import { SaleRepository } from 'Modules/Sale/Repositories/Sale.repo';

@Module({
  controllers: [GlobalController],
  providers: [
    GlobalService,
    UserRepository,
    ProductRepository,
    AcceptedCitiesRepository,
    CategoryRepository,
    whatsappDetailsRepository,
    SaleRepository
  ],
})
export class GlobalModule {}

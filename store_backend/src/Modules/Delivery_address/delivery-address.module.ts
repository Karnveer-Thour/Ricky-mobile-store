import { Module } from '@nestjs/common';
import { DeliveryAddressService } from './delivery-address.service';
import { DeliveryAddressController } from './delivery-address.controller';
import { DeliveryAddressRepository } from './Repositories/DeliveryAddress.repo';
import { UserRepository } from 'Modules/User/Repositories/User.repo';

@Module({
  controllers: [DeliveryAddressController],
  providers: [DeliveryAddressService,DeliveryAddressRepository,UserRepository],
})
export class DeliveryAddressModule {}

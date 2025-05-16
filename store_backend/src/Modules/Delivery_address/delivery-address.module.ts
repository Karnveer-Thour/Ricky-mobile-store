import { Module } from '@nestjs/common';
import { DeliveryAddressRepository } from './Repositories/DeliveryAddress.repo';

@Module({
  providers: [DeliveryAddressRepository],
})
export class DeliveryAddressModule {}

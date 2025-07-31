import { Module } from '@nestjs/common';
import { AddressRepository } from './Repositories/Address.repo';
import { AddressService } from './address.service';

@Module({
  providers: [AddressRepository,AddressService],
})
export class AddressModule {}

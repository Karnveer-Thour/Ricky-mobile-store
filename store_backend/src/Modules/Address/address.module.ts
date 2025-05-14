import { Module } from '@nestjs/common';
import { AddressRepository } from './Repositories/Address.repo';

@Module({
    providers:[AddressRepository],
})
export class AddressModule {}

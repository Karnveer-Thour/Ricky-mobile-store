import { BaseRepository } from 'Common/Repositories/Base.repo';
import { DeliveryAddress } from '../Entities/DeliveryAddress.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DeliveryAddressRepository extends BaseRepository<DeliveryAddress> {
  constructor(private readonly dataSource: DataSource) {
    super(DeliveryAddress, dataSource);
  }
}

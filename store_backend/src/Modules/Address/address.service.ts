import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AddressRepository } from './Repositories/Address.repo';
import { Address } from './Entities/Address.entity';
import { CreateAddressDto } from './Dtos/create-address.dto';
import { UpdateAddressDto } from './Dtos/update-address.dto';
import { dateToUTC } from 'Common/Utils/Utils';

@Injectable()
export class AddressService {
  constructor(private readonly AddressRepository: AddressRepository) {}

  async create(addressData: CreateAddressDto): Promise<Address> {
    try {
      const newAddress = await this.AddressRepository.save(addressData);
      return newAddress;
    } catch (error) {
      throw new InternalServerErrorException('Unable to create a new address');
    }
  }

  async update(id: string, addressData: UpdateAddressDto): Promise<boolean> {
    try {
      const existingAddress = await this.AddressRepository.findOneBy({ id });
      if (!existingAddress) {
        return false;
      }
      for (let key in existingAddress) {
        existingAddress[key] = addressData[key] ?? existingAddress[key];
      }
      await this.AddressRepository.save(existingAddress);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Unable to update a address');
    }
  }

  async softDeleteById(id: string): Promise<boolean> {
    try {
      const existingAddress = await this.AddressRepository.findOneBy({ id });
      if (!existingAddress) {
        return false;
      }
      existingAddress.deletedAt = dateToUTC();
      await this.AddressRepository.save(existingAddress);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Unable to delete a address');
    }
  }
}

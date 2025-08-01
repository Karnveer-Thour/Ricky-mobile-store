import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeliveryAddressRepository } from './Repositories/DeliveryAddress.repo';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { CreateDeliveryAddressDto } from './Dtos/create-delivery-address.dto';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { CreateAddressDto } from 'Modules/Address/Dtos/create-address.dto';
import { DeliveryAddressDto } from './Dtos/DeliveryAddress.dto';
import { UpdateDeliveryAddressDto } from './Dtos/update-delivery-address.dto';
import { dateToUTC } from 'Common/Utils/Utils';

@Injectable()
export class DeliveryAddressService {
  constructor(
    private readonly DeliveryAddressRepository: DeliveryAddressRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(deliveryAddressData: CreateDeliveryAddressDto): Promise<baseResponseDto> {
    try {
      const existingUser = await this.userRepository.findOneBy({
        id: deliveryAddressData.customerId,
      });
      if (!existingUser) {
        throw new NotFoundException('User does not exist!');
      }
      const address: CreateAddressDto = {
        houseNumber: deliveryAddressData.houseNumber,
        streetNumber: deliveryAddressData.streetNumber,
        areaName: deliveryAddressData.areaName,
        city: deliveryAddressData.city,
        pincode: deliveryAddressData.pincode,
        district: deliveryAddressData.district,
        state: deliveryAddressData.state,
      };
      const deliveryAddress: DeliveryAddressDto = {
        isDefault: deliveryAddressData.isDefault,
        label: deliveryAddressData.label,
        mobileNumber: deliveryAddressData.mobileNumber,
        countryCode: deliveryAddressData.countryCode,
        address: address,
        customer: existingUser,
      };
      const newDeliveryAddress = await this.DeliveryAddressRepository.save(deliveryAddress);
      return {
        status: true,
        code: 201,
        data: {
          deliveryAddress: newDeliveryAddress,
          message: 'Delivery Address created Successfully',
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to add new delivery address');
    }
  }

  async update(
    id: string,
    deliveryAddressData: UpdateDeliveryAddressDto,
  ): Promise<baseResponseDto> {
    try {
      const existingDeliveryAddress = await this.DeliveryAddressRepository.findOneBy({ id });
      if (!existingDeliveryAddress) {
        throw new NotFoundException('Delivery address does not found!');
      }
      for (let key in existingDeliveryAddress) {
        if (key === 'address') {
          for (let key in existingDeliveryAddress.address) {
            existingDeliveryAddress.address[key] =
              deliveryAddressData[key] ?? existingDeliveryAddress[key];
          }
          continue;
        }
        existingDeliveryAddress[key] = deliveryAddressData[key] ?? existingDeliveryAddress[key];
      }
      await this.DeliveryAddressRepository.save(existingDeliveryAddress);
      return {
        status: true,
        code: 204,
        data: {
          message: 'Delivery Address updated Successfully',
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to update delivery address');
    }
  }

  async toggleAddressStatus(id: string, status: boolean): Promise<baseResponseDto> {
    try {
      const existingDeliveryAddress = await this.DeliveryAddressRepository.findOneBy({ id });
      if (!existingDeliveryAddress) {
        throw new NotFoundException('Delivery address does not exist!');
      }
      const enabledDeliveryAddress = await this.DeliveryAddressRepository.findOneBy({
        customer: existingDeliveryAddress.customer,
        isDefault: status,
      });
      if (status) {
        enabledDeliveryAddress.isDefault = !status;
        await this.DeliveryAddressRepository.save(enabledDeliveryAddress);
      } else {
        if (!enabledDeliveryAddress) {
          throw new BadRequestException('Minimum one delivery address must be activated');
        }
      }
      existingDeliveryAddress.isDefault = status;
      await this.DeliveryAddressRepository.save(existingDeliveryAddress);
      return {
        status: true,
        code: 204,
        data: {
          message: `Delivery Address ${status ? 'enabled' : 'disabled'} Successfully`,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to toggle delivery address');
    }
  }

  async getAll(page: number, limit: number): Promise<baseResponseDto> {
    try {
      const query = this.DeliveryAddressRepository.createQueryBuilder('d_addresses')
        .orderBy('d_addresses.createdAt', 'DESC')
        .skip(page - 1)
        .take(limit);
      const [deliveryAddresses, total] = await query.getManyAndCount();
      return {
        status: true,
        code: 200,
        data: {
          deliveryAddresses,
          total,
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to fetch delivery addresses');
    }
  }

  async getById(id: string): Promise<baseResponseDto> {
    try {
      const existingDeliveryAddress = await this.DeliveryAddressRepository.findOneBy({ id });
      if (!existingDeliveryAddress) {
        throw new NotFoundException('Delivery address does not exist!');
      }
      return {
        status: true,
        code: 200,
        data: {
          address: existingDeliveryAddress,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to fetch delivery address');
    }
  }

  async softDeleteById(id: string): Promise<baseResponseDto> {
    try {
      const existingDeliveryAddress = await this.DeliveryAddressRepository.findOneBy({ id });
      if (!existingDeliveryAddress) {
        throw new NotFoundException('Delivery address does not exist!');
      }
      existingDeliveryAddress.deletedAt = dateToUTC();
      await this.DeliveryAddressRepository.save(existingDeliveryAddress);
      if (existingDeliveryAddress.isDefault) {
        const alreadyEnabledAddress = await this.DeliveryAddressRepository.findOneBy({
          customer: existingDeliveryAddress.customer,
          isDefault: true,
        });
        if (!alreadyEnabledAddress) {
          const newDefaultAddress = await this.DeliveryAddressRepository.findOne({
            where: { customer: existingDeliveryAddress.customer },
            order: { createdAt: 'DESC' },
          });
          if (!newDefaultAddress.isDefault) {
            newDefaultAddress.isDefault = true;
            await this.DeliveryAddressRepository.save(newDefaultAddress);
          }
        }
      }
      return {
        status: true,
        code: 204,
        data: {
          message: 'Delivery address deleted successfully.',
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to delete a particular delivery address');
    }
  }
}

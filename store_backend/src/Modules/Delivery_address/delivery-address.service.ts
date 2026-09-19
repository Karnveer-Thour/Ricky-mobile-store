import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
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

  async convertExistingAddressAsNotDefaultByUserId(userId: string): Promise<boolean> {
    try {
      const existingDeliveryAddress = await this.DeliveryAddressRepository.findOneBy({
        customer: { id: userId },
        isDefault: true,
      });
      if (existingDeliveryAddress) {
        existingDeliveryAddress.isDefault = false;
        await this.DeliveryAddressRepository.save(existingDeliveryAddress);
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unable to set delivery address as not default');
    }
  }

  async convertExistingAddressAsNotDefault(
    existingDeliveryAddress: DeliveryAddressDto,
  ): Promise<boolean> {
    try {
      const existingDefaultAddress = await this.DeliveryAddressRepository.findOneBy({
        customer: existingDeliveryAddress.customer,
        isDefault: true,
      });
      if (existingDefaultAddress) {
        existingDefaultAddress.isDefault = false;
        await this.DeliveryAddressRepository.save(existingDefaultAddress);
      }
      existingDeliveryAddress.isDefault = false;
      await this.DeliveryAddressRepository.save(existingDeliveryAddress);
      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unable to set delivery address as not default');
    }
  }

  async convertExistingAddressAsDefault(
    existingDeliveryAddress: DeliveryAddressDto,
  ): Promise<boolean> {
    try {
      const existingDefaultAddress = await this.DeliveryAddressRepository.findOneBy({
        customer: existingDeliveryAddress.customer,
        isDefault: false,
      });
      if (existingDefaultAddress) {
        existingDefaultAddress.isDefault = true;
        await this.DeliveryAddressRepository.save(existingDefaultAddress);
      }
      existingDeliveryAddress.isDefault = true;
      await this.DeliveryAddressRepository.save(existingDeliveryAddress);
      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unable to set delivery address as default');
    }
  }

  async create(deliveryAddressData: CreateDeliveryAddressDto): Promise<baseResponseDto> {
    try {
      const existingUser = await this.userRepository.findOneBy({
        id: deliveryAddressData.customerId,
      });
      if (!existingUser) {
        throw new NotFoundException('User does not exist!');
      }
      if (deliveryAddressData.isDefault) {
        await this.convertExistingAddressAsNotDefaultByUserId(existingUser.id);
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
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unable to add new delivery address');
    }
  }

  async update(
    id: string,
    deliveryAddressData: UpdateDeliveryAddressDto,
  ): Promise<baseResponseDto> {
    try {
      const existingDeliveryAddress = await this.DeliveryAddressRepository.findOne({
        where: { id },
        relations: ['address', 'customer'],
      });
      if (!existingDeliveryAddress) {
        throw new NotFoundException('Delivery address not found!');
      }
      if (deliveryAddressData.isDefault && !existingDeliveryAddress.isDefault) {
        if (existingDeliveryAddress.customer?.id) {
          await this.convertExistingAddressAsNotDefaultByUserId(existingDeliveryAddress.customer.id);
        } else {
          await this.convertExistingAddressAsNotDefault(existingDeliveryAddress);
        }
      }

      if (existingDeliveryAddress.address) {
        if (deliveryAddressData.houseNumber !== undefined) {
          existingDeliveryAddress.address.houseNumber = deliveryAddressData.houseNumber;
        }
        if (deliveryAddressData.streetNumber !== undefined) {
          existingDeliveryAddress.address.streetNumber = deliveryAddressData.streetNumber;
        }
        if (deliveryAddressData.areaName !== undefined) {
          existingDeliveryAddress.address.areaName = deliveryAddressData.areaName;
        }
        if (deliveryAddressData.city !== undefined) {
          existingDeliveryAddress.address.city = deliveryAddressData.city;
        }
        if (deliveryAddressData.pincode !== undefined) {
          existingDeliveryAddress.address.pincode = Number(deliveryAddressData.pincode);
        }
        if (deliveryAddressData.district !== undefined) {
          existingDeliveryAddress.address.district = deliveryAddressData.district;
        }
        if (deliveryAddressData.state !== undefined) {
          existingDeliveryAddress.address.state = deliveryAddressData.state;
        }
      }

      if (deliveryAddressData.label !== undefined) {
        existingDeliveryAddress.label = deliveryAddressData.label;
      }
      if (deliveryAddressData.mobileNumber !== undefined) {
        const cleanMobile = deliveryAddressData.mobileNumber.replace(/\D/g, '').slice(-10);
        existingDeliveryAddress.mobileNumber = cleanMobile;
      }
      if (deliveryAddressData.countryCode !== undefined) {
        existingDeliveryAddress.countryCode = deliveryAddressData.countryCode;
      }
      if (deliveryAddressData.isDefault !== undefined) {
        existingDeliveryAddress.isDefault = deliveryAddressData.isDefault;
      }

      await this.DeliveryAddressRepository.save(existingDeliveryAddress);
      return {
        status: true,
        code: 200,
        data: {
          deliveryAddress: existingDeliveryAddress,
          message: 'Delivery Address updated Successfully',
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unable to update delivery address');
    }
  }

  async toggleAddressStatus(id: string, status: boolean): Promise<baseResponseDto> {
    try {
      const existingDeliveryAddress = await this.DeliveryAddressRepository.findOneBy({ id });
      if (!existingDeliveryAddress) {
        throw new NotFoundException('Delivery address does not exist!');
      }
      if (status && !existingDeliveryAddress.isDefault) {
        await this.convertExistingAddressAsNotDefault(existingDeliveryAddress);
      } else if (!status && existingDeliveryAddress.isDefault) {
        await this.convertExistingAddressAsDefault(existingDeliveryAddress);
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
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unable to toggle delivery address');
    }
  }

  async getAll(page: number, limit: number, userId?: string): Promise<baseResponseDto> {
    try {
      const pageNumber = Math.max(1, page || 1);
      const limitNumber = Math.max(1, limit || 10);

      const query = this.DeliveryAddressRepository.createQueryBuilder('d_addresses')
        .leftJoinAndSelect('d_addresses.address', 'address')
        .leftJoinAndSelect('d_addresses.customer', 'customer')
        .orderBy('d_addresses.createdAt', 'DESC');

      if (userId) {
        query.andWhere('customer.id = :userId', { userId });
      }

      query.skip((pageNumber - 1) * limitNumber).take(limitNumber);
      const [deliveryAddresses, total] = await query.getManyAndCount();
      return {
        status: true,
        code: 200,
        data: {
          deliveryAddresses,
          total,
          page: pageNumber,
          pageSize: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
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
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unable to fetch delivery address');
    }
  }

  async softDeleteById(id: string): Promise<baseResponseDto> {
    try {
      const existingDeliveryAddress = await this.DeliveryAddressRepository.findOne({
        where: { id },
        relations: ['customer'],
      });
      if (!existingDeliveryAddress) {
        throw new NotFoundException('Delivery address does not exist!');
      }

      // Enforce: user must keep at least one delivery address
      if (existingDeliveryAddress.customer?.id) {
        const remainingCount = await this.DeliveryAddressRepository.count({
          where: {
            customer: { id: existingDeliveryAddress.customer.id },
          },
        });
        if (remainingCount <= 1) {
          throw new BadRequestException('You must keep at least one delivery address.');
        }
      }

      if (existingDeliveryAddress.isDefault) {
        await this.convertExistingAddressAsDefault(existingDeliveryAddress);
      }
      existingDeliveryAddress.deletedAt = dateToUTC();
      existingDeliveryAddress.isDefault = false;
      await this.DeliveryAddressRepository.save(existingDeliveryAddress);
      return {
        status: true,
        code: 200,
        data: {
          message: 'Delivery address deleted successfully.',
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        error.message || 'Unable to delete a particular delivery address',
      );
    }
  }
}

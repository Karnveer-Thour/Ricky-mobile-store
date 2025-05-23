import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from './Repositories/User.repo';
import { UserDto } from './Dtos/User.dto';
import { AddressDto } from 'Modules/Address/Dtos/Address.dto';
import { User } from './Entities/User.entity';
import { role } from './Model/Role.model';
import * as bcrypt from 'bcrypt';
import { updateUserDto } from './Dtos/UpdateUser.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async registerUser(user: UserDto, address: AddressDto): Promise<string | UserDto> {
    try {
      if (user.mobileNumber) {
        const existedUser = await this.userRepository.find({
          where: { mobileNumber: user.mobileNumber },
        });
        if (existedUser.length !== 0) {
          return 'User already exists';
        }
      }
      const existedUser = await this.userRepository.find({ where: { email: user.email } });
      if (existedUser.length !== 0) {
        return 'User already exists';
      }
      user.password = await bcrypt.hash(user.password + process.env.PASSWORD_PEPPER, 10);
      return await this.userRepository.save({ ...user, address });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getCustomers(): Promise<User[]> {
    try {
      return await this.userRepository.find({ where: { role: role.Customer } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { id: id } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateUserData: updateUserDto): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new InternalServerErrorException('User not found');
      }
      for (let key in updateUserData) {
        updateUserData[key] = updateUserData[key] ?? user[key];
      }
      const result = await this.userRepository.update(id, updateUserData);
      return {
        code: 204,
        status: true,
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async softDeleteById(id: string): Promise<any> {
    try {
      const result = await this.userRepository.softDelete(id);
      return {
        code: 204,
        status: true,
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

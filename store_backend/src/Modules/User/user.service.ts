import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from './Repositories/User.repo';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { loginUserDto } from './Dtos/login-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async login(user: loginUserDto): Promise<baseResponseDto> {
    try {
      return;
    } catch (error) {
      throw new InternalServerErrorException('Error logging in user');
    }
  }
}

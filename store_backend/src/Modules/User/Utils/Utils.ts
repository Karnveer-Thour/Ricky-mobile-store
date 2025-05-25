import { InternalServerErrorException } from '@nestjs/common';
import { loginCredentialsDto } from '../Dtos/LoginCredentials.dto';
import { User } from '../Entities/User.entity';
import * as bcrypt from 'bcrypt';

export const checkPassword = async (password: string, hashPassword: string): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password + process.env.PASSWORD_PEPPER, hashPassword);
    return isMatch;
  } catch (error) {
    throw new InternalServerErrorException(error);
  }
};

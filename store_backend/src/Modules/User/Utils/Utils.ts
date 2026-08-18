import { InternalServerErrorException } from '@nestjs/common';
import { User } from '../Entities/User.entity';
import * as bcrypt from 'bcrypt';
import { ENV_CONFIG } from 'Common/constants';

export const checkPassword = async (password: string, hashPassword: string): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(
      password + ENV_CONFIG.SECURITY.PASSWORD_PEPPER,
      hashPassword,
    );
    return isMatch;
  } catch (error) {
    throw new InternalServerErrorException(error);
  }
};

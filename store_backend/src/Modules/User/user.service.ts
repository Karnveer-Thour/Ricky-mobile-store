import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './Repositories/User.repo';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { loginUserDto } from './Dtos/login-user.dto';
import { CreateUserDto } from './Dtos/create-user.dto';
import { role } from './Model/Role.model';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { TransformCustomerUserDto } from './Dtos/response-customer-user.dto';
import { updateUserDto } from './Dtos/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'Core/Firebase/firebase.service';
import { dateToUTC } from 'Common/Utils/Utils';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
  ) {}

  async userToken(userId: string, userRole: role): Promise<string> {
    try {
      const token = await this.jwtService.signAsync({ userId, userRole });
      return token;
    } catch (error) {
      console.error('Error generating user token:', error);
      throw new InternalServerErrorException('Error generating user token');
    }
  }

  async getUserDataFromToken(token: string): Promise<{ id: string; role: role }> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async bycryptPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new InternalServerErrorException('Error hashing password');
    }
  }

  async loginWithSocialMedia(token: string): Promise<baseResponseDto> {
    try {
      const decoded = await this.firebaseService.verifyToken(token);

      const { uid, email, name, picture } = decoded;

      const user = this.userRepository.findOneBy({ email });

      if (!user) {
        const parts = name?.trim().split(' ') ?? [];
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';
        const newUser: CreateUserDto = {
          email,
          firstName,
          lastName,
          pictureUrl: picture,
          password: '',
          role: role.Admin,
          mobileNumber: '',
          dateBirth: '',
          age: 0,
        };
        await this.userRepository.save(newUser);
      }

      return {
        code: 200,
        status: true,
        data: {
          token: token,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Invalid firebase token');
    }
  }

  async login(user: loginUserDto): Promise<baseResponseDto> {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: user.email,
        role: user.role,
      });

      if (!existingUser) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      if (user.role === role.Admin) {
        const isAdmin = await admin.auth().getUserByEmail(user.email);
        if (!isAdmin || !isAdmin.customClaims?.admin) {
          throw new UnauthorizedException('User is not admin');
        }
      }

      const userToken = await this.userToken(existingUser.id, existingUser.role);
      return {
        code: 200,
        status: true,
        data: {
          token: userToken,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error logging in user');
    }
  }

  async register(user: CreateUserDto): Promise<baseResponseDto> {
    let firebaseUser: admin.auth.UserRecord | null = null;
    try {
      const existingUser = await this.userRepository.findOneBy({ email: user.email });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      user.password = await this.bycryptPassword(user.password);

      if (user.role === role.Admin) {
        firebaseUser = await this.firebaseService.createUser(user.email, user.password);
        await admin.auth().setCustomUserClaims(firebaseUser.uid, { admin: true });
      }

      const newUser = await this.userRepository.save(user);
      const userToken = await this.userToken(newUser.id, newUser.role);
      return {
        code: 201,
        status: true,
        data: userToken,
      };
    } catch (error) {
      if (firebaseUser?.uid) {
        await admin.auth().deleteUser(firebaseUser.uid);
      }
      console.error('Error registering user:', error);
      throw new InternalServerErrorException('Error registering user');
    }
  }

  async updateUserById(id: string, userData: updateUserDto): Promise<baseResponseDto> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      for (let key in userData) {
        user[key] = userData[key] ?? user[key];
      }

      await this.userRepository.save(user);
      return {
        status: true,
        code: 200,
        data: {
          message: 'User updated successfully.',
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching customers');
    }
  }

  async getAllCustomers(
    page: number = 1,
    limit: number = 10,
    searchText: string = null,
  ): Promise<baseResponseDto> {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: role.Customer })
        .andWhere('user.deletedAt IS NULL');

      if (searchText) {
        queryBuilder.andWhere(
          `(LOWER(CONCAT(user.firstName, ' ', user.lastName)) ILIKE :searchText 
           OR LOWER(user.email) ILIKE :searchText 
           OR user.mobileNumber ILIKE :searchText)`,
          { searchText: `%${searchText.toLowerCase()}%` },
        );
      }

      queryBuilder.skip((page - 1) * limit).take(limit);

      const [customers, total] = await queryBuilder.getManyAndCount();
      const transformedCustomers = customers.map((customer) =>
        plainToInstance(TransformCustomerUserDto, customer, { excludeExtraneousValues: true }),
      );

      return {
        status: true,
        code: 200,
        data: {
          transformedCustomers,
          total,
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching customers');
    }
  }

  async getByToken(token: string): Promise<baseResponseDto> {
    try {
      const { id, role } = await this.getUserDataFromToken(token);
      const user = await this.userRepository.findOneBy({ id, role });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        status: true,
        code: 200,
        data: {
          user,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async softDeleteUserById(id: string): Promise<baseResponseDto> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.deletedAt = dateToUTC();
      await this.userRepository.save(user);
      return {
        status: true,
        code: 200,
        data: { message: 'User deleted successfully' },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error Deleting User');
    }
  }
}

import { Module } from '@nestjs/common';
import { UserRepository } from './Repositories/User.repo';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entities/User.entity';
import { AddressRepository } from 'Modules/Address/Repositories/Address.repo';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseService } from 'Core/Firebase/firebase.service';
import { JWT_DEFAULT_EXPIRY } from 'Common/constants';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: JWT_DEFAULT_EXPIRY },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, AddressRepository, FirebaseService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserRepository } from './Repositories/User.repo';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entities/User.entity';
import { AddressRepository } from 'Modules/Address/Repositories/Address.repo';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository,AddressRepository],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserRepository } from './Repositories/User.repo';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService,UserRepository],
})
export class UserModule {}

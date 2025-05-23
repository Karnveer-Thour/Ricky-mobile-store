import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './Dtos/CreateUser.dto';
import { UserDto } from './Dtos/User.dto';
import { User } from './Entities/User.entity';
import { updateUserDto } from './Dtos/UpdateUser.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async registerUser(@Body() userData: CreateUserDto): Promise<UserDto | string> {
    return await this.userService.registerUser(userData.user, userData.address);
  }

  @Get('/customers')
  async getCustomers(): Promise<User[]> {
    return await this.userService.getCustomers();
  }

  @Get('/:id')
  async getById(@Param(':id') id: string): Promise<User> {
    return await this.userService.getById(id);
  }

  @Patch('/:id')
  async update(@Param(':id') id:string,updateData:updateUserDto):Promise<any>{
    return this.userService.update(id,updateData);
  }

  @Delete('/:id')
  async softDeleteById(@Param(':id')id:string):Promise<any>{
    return this.userService.softDeleteById(id);
  }
}

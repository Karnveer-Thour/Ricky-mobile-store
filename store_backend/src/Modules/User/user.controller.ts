import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {  ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './Dtos/CreateUser.dto';
import { UserDto } from './Dtos/User.dto';
import { User } from './Entities/User.entity';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Post()
    async registerUser(@Body() userData:CreateUserDto): Promise<UserDto|string> {
        return await this.userService.registerUser(userData.user,userData.address);
    }

    @Get('/customers')
    async getCustomers():Promise<User[]>{
        return await this.userService.getCustomers();
    }

    @Get('/:id')
    async getById(@Param(':id')id:string):Promise<User>{
        return await this.userService.getById(id);
    }

}

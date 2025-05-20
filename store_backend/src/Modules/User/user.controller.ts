import { Body, Controller, Post } from '@nestjs/common';
import {  ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './Dtos/CreateUser.dto';
import { UserDto } from './Dtos/User.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Post()
    registerUser(@Body() userData:CreateUserDto): Promise<UserDto|string> {
        return this.userService.registerUser(userData.user,userData.address);
    }
}

import { Body, Controller, Post } from '@nestjs/common';
import {  ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from './Dtos/User.dto';
import { AddressDto } from 'Modules/Address/Dtos/Address.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Post()
    registerUser(@Body() User: UserDto,@Body() Address:AddressDto): any {
        return this.userService.registerUser(User,Address);
    }
}

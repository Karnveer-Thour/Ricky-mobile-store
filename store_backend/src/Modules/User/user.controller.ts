import { Controller, Post } from '@nestjs/common';
import {  ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Post()
    registerUser():string{
        return "User created";
    }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { loginUserDto } from './Dtos/login-user.dto';
import { CreateUserDto } from './Dtos/create-user.dto';
import { updateUserDto } from './Dtos/update-user.dto';
import { Public } from 'Common/Decorators/public.decorator';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<baseResponseDto> {
    return this.userService.register(user);
  }

  @Public()
  @Post('login')
  async login(@Body() userCredentials: loginUserDto): Promise<baseResponseDto> {
    return this.userService.login(userCredentials);
  }

  @Put('{:id}')
  async updateUserById(
    @Param('id') id: string,
    @Body() UserData: updateUserDto,
  ): Promise<baseResponseDto> {
    return this.userService.updateUserById(id, UserData);
  }

  @Get('{:page}/{:limit}')
  @Get(':page/:limit')
  async getAllCustomers(@Param('page') page?: string, @Param('limit') limit?: string) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    return this.userService.getAllCustomers(pageNumber, limitNumber);
  }

  @Get('{:token}')
  async getByToken(@Param('token') token: string): Promise<baseResponseDto> {
    return this.userService.getByToken(token);
  }

  @Delete('{:id}')
  async deleteById(@Param('id') id: string) {
    return this.userService.softDeleteUserById(id);
  }
}

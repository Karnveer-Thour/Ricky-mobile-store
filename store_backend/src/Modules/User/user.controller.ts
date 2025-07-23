import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { loginUserDto } from './Dtos/login-user.dto';
import { CreateUserDto } from './Dtos/create-user.dto';
import { updateUserDto } from './Dtos/update-user.dto';
import { Public } from 'Common/Decorators/public.decorator';
import { UserPaginationQueryDto } from './Dtos/user-pagination-query.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<baseResponseDto> {
    return this.userService.register(user);
  }

  @Post('login/social/{:token}')
  async loginWithSocialMedia(@Param('token') token: string): Promise<baseResponseDto> {
    return this.userService.loginWithSocialMedia(token);
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

  @Get()
  async getAllCustomers(@Query() query: UserPaginationQueryDto): Promise<baseResponseDto> {
    const pageNumber = parseInt(query.page, 10) || 1;
    const limitNumber = parseInt(query.limit, 10) || 10;
    const searchText = query.searchText || null;

    return this.userService.getAllCustomers(pageNumber, limitNumber, searchText);
  }

  @Get('{:token}')
  async getByToken(@Param('token') token: string): Promise<baseResponseDto> {
    return this.userService.getByToken(token);
  }

  @Delete('{:id}')
  async deleteById(@Param('id') id: string): Promise<baseResponseDto> {
    return this.userService.softDeleteUserById(id);
  }
}

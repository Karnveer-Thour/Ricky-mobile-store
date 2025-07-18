import { BaseDto } from 'Common/Dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { AddressDto } from 'Modules/Address/Dtos/Address.dto';
import {
  ValidateNested,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { role } from '../Model/Role.model';
import { birthToAge } from 'Common/Utils/Utils';

export class CreateUserDto extends BaseDto {
  @ApiProperty({ example: 'Ricky', required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  firstName: string;

  @ApiProperty({ example: 'makol', required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  lastName: string;

  @ApiProperty({ example: 'Ricky@gmail.com', required: true })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email: string;

  @ApiProperty({ example: '**********', required: true })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({ example: '22.jpg', required: false })
  @IsString()
  @IsOptional()
  pictureUrl: string;

  @ApiProperty({ example: role.Admin, required: true })
  @IsEnum(role)
  @IsNotEmpty()
  role: role;

  @ApiProperty({ example: '9456862378', required: false })
  @IsString()
  @IsOptional()
  mobileNumber: string;

  @ApiProperty({ example: '1975-11-20', format: 'date', required: false })
  @IsOptional()
  @IsDateString()
  dateBirth: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ obj }) => birthToAge(obj.dateBirth), { toClassOnly: true })
  age: number;

  @ApiProperty({
    description: 'Enter your house number',
    example: 'L-34',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(15, {
    message: 'House number must be at most 15 characters long',
  })
  houseNumber?: string;

  @ApiProperty({
    description: 'Enter your Street number',
    example: '3R',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(25, {
    message: 'Street number must be at most 25 characters long',
  })
  streetNumber?: string;

  @ApiProperty({
    description: 'Enter your Area name',
    example: 'Gulmohar Nagar',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(150, {
    message: 'Area name must be at most 150 characters long',
  })
  areaName?: string;

  @ApiProperty({
    description: 'Enter your City name',
    example: 'Chandigarh',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'City name must be at most 30 characters long' })
  city?: string;

  @ApiProperty({
    description: 'Enter your City pincode',
    example: '16001',
    type: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  pincode?: number;

  @ApiProperty({
    description: 'Enter your District name',
    example: 'Chandigarh',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(30, {
    message: 'District name must be at most 30 characters long',
  })
  district?: string;

  @ApiProperty({
    description: 'Enter your State name',
    example: 'Punjab',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'State name must be at most 20 characters long' })
  state?: string;
}

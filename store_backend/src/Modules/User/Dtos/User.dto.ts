import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseDto } from 'Common/Dto/base.dto';
import { birthToAge } from 'Common/Utils/Utils';
import { ApiProperty } from '@nestjs/swagger';
import { role } from '../Model/Role.model';

export class UserDto extends BaseDto {
  @ApiProperty({
    description: 'Enter the first name of user',
    example: 'Ricky',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(25, { message: 'First name must be at most 25 characters long' })
  firstName: string;

  @ApiProperty({
    description: 'Enter the last name of user',
    example: 'makol',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(25, { message: 'Last name must be at most 25 characters long' })
  lastName: string;

  @ApiProperty({
    description: 'Enter the email of user',
    example: 'Ricky@gmail.com',
    type: 'string',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254, { message: 'Email must be at most 254 characters long' })
  email: string;

  @ApiProperty({
    description: 'Enter the password for user',
    example: '**********',
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(255, { message: 'Password must be at most 255 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'Enter the Url of picture that stored in cloud',
    example: '22.jpg',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  pictureUrl: string;

  @ApiProperty({
    description: 'Enter the role of user',
    example: role.Admin,
    type: 'string',
    required: true,
  })
  @IsEnum(role)
  @IsNotEmpty()
  role: role;

  @ApiProperty({
    description: 'Enter the mobile number of user',
    example: '9456862378',
    type: 'string',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  mobileNumber: string;

  @ApiProperty({
    description: 'Enter the Birth date of user',
    example: '1975-11-20',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateBirth: Date;

  @IsNumber()
  @Transform(({ obj }) => birthToAge(obj.dateBirth), { toClassOnly: true })
  age: number;
}

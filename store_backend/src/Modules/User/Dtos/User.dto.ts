import { Transform, Type } from 'class-transformer';
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
}

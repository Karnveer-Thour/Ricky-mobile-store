import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { BaseDto } from 'Common/Dto/base.dto';
import { role } from '../Model/Role.model';

export class loginUserDto extends BaseDto {
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

  @ApiProperty({ example: role.Admin, required: true })
  @IsEnum(role)
  @IsNotEmpty()
  role: role;
}

import { BaseDto } from 'Common/Dto/Base.dto';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { label } from '../Model/Label.model';
import { User } from 'Modules/User/Entities/User.entity';
import { CreateAddressDto } from 'Modules/Address/Dtos/create-address.dto';

export class DeliveryAddressDto extends BaseDto {
  @ApiProperty({
    description: 'Make this record active',
    example: true,
    type: 'boolean',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault: boolean;

  @ApiProperty({
    description: 'Select type of address',
    example: label.Home,
    type: 'string',
    required: false,
  })
  @IsEnum(label)
  @IsOptional()
  label: label;

  @IsNotEmpty()
  customer: User;

  @IsNotEmpty()
  address: CreateAddressDto;

  @Matches(/^\+\d{1,4}$/, {
    message: 'Country code must start with "+" followed by 1–4 digits',
  })
  countryCode: string;

  @IsNotEmpty()
  @IsNumber()
  @Matches(/^\d{10}$/, {
    message: 'Mobile number must be exactly 10 digits',
  })
  mobileNumber: string;
}

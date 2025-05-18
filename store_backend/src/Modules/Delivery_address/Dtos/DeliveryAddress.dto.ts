import { BaseDto } from 'Common/Dto/Base.dto';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { label } from '../Model/Label.model';

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
}

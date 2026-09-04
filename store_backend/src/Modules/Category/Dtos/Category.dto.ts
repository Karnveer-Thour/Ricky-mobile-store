import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';

export class CategoryDto extends BaseDto {
  @ApiProperty({
    description: 'Enter Category name',
    example: 'Mobile Device',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name must be at most 100 characters long' })
  name: string;

  @ApiProperty({
    description: 'Enter Category description',
    example: 'Daily use mobile device',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(550, {
    message: 'Description must be at most 550 characters long',
  })
  description: string;

  @ApiProperty({
    description: 'Specify if category supports color variants',
    example: true,
    type: 'boolean',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  hasColors?: boolean;

  @ApiProperty({
    description: 'Specify if category supports specification/storage variants',
    example: false,
    type: 'boolean',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean;
}

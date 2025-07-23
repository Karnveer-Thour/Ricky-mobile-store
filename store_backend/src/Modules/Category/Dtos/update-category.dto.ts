import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';

export class UpdateCategoryDto extends BaseDto {
  @ApiProperty({
    description: 'Enter Category name',
    example: 'Mobile Device',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Name must be at most 100 characters long' })
  name: string;

  @ApiProperty({
    description: 'Enter Category description',
    example: 'Daily use mobile device',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(550, {
    message: 'Description must be at most 550 characters long',
  })
  description: string;
}

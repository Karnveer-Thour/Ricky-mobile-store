import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from 'Common/Dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductVariantDto extends BaseDto {
  @ApiProperty({ name: 'ram', description: 'e.g. 8 GB', required: false })
  @IsOptional()
  @IsString()
  ram?: string;

  @ApiProperty({ name: 'storage', description: 'e.g. 256 GB', required: false })
  @IsOptional()
  @IsString()
  storage?: string;

  @ApiProperty({ name: 'color', description: 'e.g. Phantom Black', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ name: 'quantity', description: 'Stock quantity for this variant', required: true })
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Variant quantity cannot be negative' })
  quantity: number;
}

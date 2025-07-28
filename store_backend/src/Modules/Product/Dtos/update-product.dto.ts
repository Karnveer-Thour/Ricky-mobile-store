import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';
import { CreateProductColorDto } from './create-color.dto';
import { ProductColorDto } from './ProductColor.dto';
import { ProductColor } from '../Entities/ProductColor.entity';

export class UpdateProductDto extends BaseDto {
  @ApiProperty({
    description: 'Enter Product name',
    example: 'Redmi Note 14 pro+',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(150, { message: 'Name must be at most 150 characters long' })
  name: string;

  @ApiProperty({
    description: 'Enter Product amount',
    example: '27000',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Price must be at most 20 characters long' })
  price: string;

  @ApiProperty({
    description: 'Enter discount applied on product',
    example: '3000',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Discount must be at most 20 characters long' })
  discount: string;

  @ApiProperty({
    description: 'Enter Product description',
    example: 'Mid range flagship device by redmi',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1500, {
    message: 'Description must be at most 1500 characters long',
  })
  description: string;

  @ApiProperty({
    description: 'Enter Product quantiy',
    example: 35,
    type: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  quantiy: number;

  @ApiProperty({
    description: 'Enter Product specifications',
    example: 'AMOLED, 68B colors, 120Hz, HDR10+, Dolby Vision, 3000 nits (peak)',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1500, {
    message: 'Specifications must be at most 1500 characters long',
  })
  specifications: string;

  @ApiProperty({
    description: 'Enter Product warranty',
    example: 'one year',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Warranty must be at most 100 characters long' })
  warranty: string;

  @ApiProperty({
    description: 'Enter Product colors and Quantity',
    example: 'one year',
    type: 'string',
    required: false,
  })
  @IsObject()
  @IsOptional()
  productColors: ProductColor[];
}

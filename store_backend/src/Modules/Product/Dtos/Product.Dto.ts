import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';

export class ProductDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150, { message: 'Name must be at most 150 characters long' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'Price must be at most 20 characters long' })
  price: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Discount must be at most 20 characters long' })
  discount: string;

  @IsString()
  @IsOptional()
  @MaxLength(1500, {
    message: 'Description must be at most 1500 characters long',
  })
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(1500, {
    message: 'Specifications must be at most 1500 characters long',
  })
  specifications: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Warranty must be at most 100 characters long' })
  warranty: string;
}

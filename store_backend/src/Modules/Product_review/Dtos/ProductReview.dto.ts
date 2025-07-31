import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';
import { Product } from 'Modules/Product/Entities/Product.entity';
import { User } from 'Modules/User/Entities/User.entity';

export class ProductReview extends BaseDto {
  @ApiProperty({
    description: 'Enter title of product review',
    example: 'Appreciatable',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(55)
  title: string;

  @ApiProperty({
    description: 'Enter description of product review',
    example: 'Good device with curve display...',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(550)
  description: string;

  @IsNotEmpty()
  reviewedBy: User;

  @IsNotEmpty()
  reviewedProduct: Product;
}

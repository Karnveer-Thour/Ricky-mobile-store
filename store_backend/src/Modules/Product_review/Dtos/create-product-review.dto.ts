import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';

export class CreateProductReview extends BaseDto {
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

  @ApiProperty({
    description: 'Enter user Id',
    example: 'gjfhgiyer#hgkjhrfgjkhkj974ihj',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  reviewedById: string;

  @ApiProperty({
    description: 'Enter product Id',
    example: 'gkdfsjgkdfhkj#jfhko3028',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  reviewedProductId: string;

  @ApiProperty({
    description: 'Star rating 1-5',
    example: 4,
    type: 'integer',
    required: true,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;
}

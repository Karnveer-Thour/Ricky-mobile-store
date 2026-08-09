import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';

export class UpdateProductReview extends BaseDto {
  @ApiProperty({
    description: 'Enter title of product review',
    example: 'Appreciatable',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsOptional()
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
    description: 'Star rating 1-5',
    example: 4,
    type: 'integer',
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;
}

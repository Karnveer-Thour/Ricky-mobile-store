import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { BaseDto } from "Common/Dto/Base.dto";

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
}
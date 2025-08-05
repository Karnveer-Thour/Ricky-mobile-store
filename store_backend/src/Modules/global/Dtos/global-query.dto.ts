import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GlobalQueryDto {
  @ApiPropertyOptional({
    description: 'Search query string',
    example: 'example query',
  })
  @IsNotEmpty()
  @IsString()
  query?: string;
}

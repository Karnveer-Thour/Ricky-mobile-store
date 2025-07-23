import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserPaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number', example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Limit per page', example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ description: 'Search text (firstname,lastname,email,mobile number etc.)' })
  @IsOptional()
  @IsString()
  searchText?: string;
}

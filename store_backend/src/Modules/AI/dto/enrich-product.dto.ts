import { IsOptional, IsString } from 'class-validator';

export class EnrichProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  price?: number | string;
}

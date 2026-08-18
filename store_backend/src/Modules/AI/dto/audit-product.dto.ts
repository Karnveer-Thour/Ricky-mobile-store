import { IsArray, IsOptional, IsString } from 'class-validator';

export class AuditProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  price?: number | string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  colors?: Array<{ name: string; quantity: number }>;
}

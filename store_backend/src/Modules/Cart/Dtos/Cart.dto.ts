import { IsArray, IsNotEmpty, IsOptional, IsUUID, ValidateNested } from 'class-validator';

export class CartDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  productIds: string[];

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

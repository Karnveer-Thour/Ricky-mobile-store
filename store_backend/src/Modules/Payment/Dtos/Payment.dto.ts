import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class PaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  message?: string;

  @IsUUID()
  @IsNotEmpty()
  buyerId: string;

  @IsUUID()
  @IsNotEmpty()
  orderId: string;
}

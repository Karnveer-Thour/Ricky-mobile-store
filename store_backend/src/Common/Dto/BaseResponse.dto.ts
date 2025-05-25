import { IsBoolean, IsNumber, IsObject } from 'class-validator';

export class baseResponseDto {
  @IsNumber()
  code: number;

  @IsBoolean()
  status: boolean;

  data: any;
}

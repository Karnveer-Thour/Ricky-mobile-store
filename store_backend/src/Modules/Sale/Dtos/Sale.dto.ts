import { BaseDto } from 'Common/Dto/Base.dto';
import { status } from '../Entities/Sale.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class SaleDto extends BaseDto {
  @IsNotEmpty()
  @IsEnum(status)
  status: status;
}

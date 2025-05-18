import { BaseDto } from 'Common/Dto/Base.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { status } from '../Model/Status.enum';

export class SaleDto extends BaseDto {
  @ApiProperty({
    description: 'Enter status of order',
    example: status.CONFIRMED,
    type: 'string',
    required: false,
  })
  @IsNotEmpty()
  @IsEnum(status)
  status: status;
}

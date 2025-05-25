import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseDto } from 'Common/Dto/base.dto';

export class whatsappDetailsDto extends BaseDto {
  @ApiProperty({
    name: 'Group_name',
    description: 'Car pool Khanna - MGG - Mohali - Chd',
    nullable: false,
  })
  @IsString()
  name: string;

  @ApiProperty({
    name: 'Group_url',
    description: 'eg. https://chat.whatsapp.com/GPe72iEM69k73D5geWMm8C',
    nullable: false,
  })
  @IsString()
  url: string;
}

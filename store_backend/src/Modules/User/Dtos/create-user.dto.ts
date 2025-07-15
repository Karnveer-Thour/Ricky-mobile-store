import { BaseDto } from 'Common/Dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { AddressDto } from 'Modules/Address/Dtos/Address.dto';
import { ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto extends BaseDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserDto)
  @ApiProperty({ type: () => UserDto })
  user: UserDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  @ApiProperty({ type: () => AddressDto })
  address: AddressDto;
}

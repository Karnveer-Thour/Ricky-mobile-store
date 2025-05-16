import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';

export class CategoryDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name must be at most 100 characters long' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(550, {
    message: 'Description must be at most 550 characters long',
  })
  description: string;
}

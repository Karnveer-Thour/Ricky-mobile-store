import { IsNotEmpty, IsString } from 'class-validator';

export class EnrichCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

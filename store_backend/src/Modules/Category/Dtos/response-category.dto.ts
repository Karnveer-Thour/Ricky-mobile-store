import { Expose } from 'class-transformer';
export class TransformCategoryDto {
  @Expose()
  name: string;

  @Expose()
  description: string;
}

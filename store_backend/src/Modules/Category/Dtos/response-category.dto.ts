import { Expose } from 'class-transformer';
export class TransformCategoryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  hasColors: boolean;

  @Expose()
  hasVariants: boolean;
}

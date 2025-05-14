// Admin/Dto/admin.dto.ts
import { Expose, Transform } from 'class-transformer';
import { BaseDto } from 'Common/Dto/base.dto';
import { birthToAge } from 'Common/Utils/Utils';

export class AdminDto extends BaseDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  mobileNumber: string;

  @Expose()
  dateBirth: Date;

  @Expose()
  @Transform(({ obj }) => birthToAge(obj.dateBirth), { toClassOnly: true })
  age: number;
}

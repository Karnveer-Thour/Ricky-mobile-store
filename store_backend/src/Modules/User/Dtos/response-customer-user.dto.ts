import { Expose } from 'class-transformer';
export class TransformCustomerUserDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  pictureUrl: string;

  @Expose()
  mobileNumber: string;

  @Expose()
  dateBirth: string;

  @Expose()
  age: number;
}

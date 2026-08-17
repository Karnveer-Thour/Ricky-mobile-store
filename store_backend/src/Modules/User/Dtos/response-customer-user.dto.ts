import { Expose } from 'class-transformer';
export class TransformCustomerUserDto {
  @Expose()
  id: string;

  @Expose()
  _id: string;

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

import { Expose } from 'class-transformer';
export class TransformAcceptedCitiesDto {
  @Expose()
  id: string;

  @Expose()
  cityName: string;

  @Expose()
  cityPincode: string;

  @Expose()
  district: string;

  @Expose()
  state: string;

  @Expose()
  isAccepting: boolean;
}

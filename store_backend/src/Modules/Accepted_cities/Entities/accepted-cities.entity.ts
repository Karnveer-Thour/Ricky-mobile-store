import { BaseEntity } from 'Common/Entities/Base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class AcceptedCities extends BaseEntity<AcceptedCities> {
  @Column({ name: 'city', type: 'varchar', length: '30', nullable: false })
  cityName: string;

  @Column({ name: 'pincode', type: 'numeric', nullable: false })
  cityPincode: number;

  @Column({ name: 'district', type: 'varchar', length: '30', nullable: false })
  district: string;

  @Column({ name: 'state', type: 'varchar', length: '20', nullable: false })
  state: string;

  @Column({ name: 'isAccepting', type: 'boolean', nullable: true, default: false })
  isAccepting: boolean;
}

import { BaseEntity } from 'Common/Entities/Base.entity';
import { DeliveryAddress } from 'Modules/Delivery_address/Entities/DeliveryAddress.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Column, Entity, Index, OneToOne } from 'typeorm';

@Entity()
@Index(['houseNumber', 'streetNumber', 'areaName', 'city', 'pincode', 'district', 'state'])
export class Address extends BaseEntity<Address> {
  @Column({
    name: 'houseNumber',
    type: 'varchar',
    length: '15',
    nullable: true,
  })
  houseNumber: string;

  @Column({
    name: 'streetNumber',
    type: 'varchar',
    length: '25',
    nullable: true,
  })
  streetNumber: string;

  @Column({
    name: 'areaName',
    type: 'varchar',
    length: '150',
    nullable: true,
  })
  areaName: string;

  @Column({ name: 'city', type: 'varchar', length: '30', nullable: true })
  city: string;

  @Column({ name: 'pincode', type: 'numeric', nullable: true })
  pincode: number;

  @Column({ name: 'district', type: 'varchar', length: '30', nullable: true })
  district: string;

  @Column({ name: 'state', type: 'varchar', length: '20', nullable: false })
  state: string;

  //Inverse relations
  @OneToOne(() => DeliveryAddress, (deliveryAddress) => deliveryAddress.address)
  deliveryAddress: DeliveryAddress;

  @OneToOne(() => User, (userAddress) => userAddress.address)
  userAddress: User;
}

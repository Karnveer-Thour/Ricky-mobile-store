import { BaseEntity } from 'Common/Entities/Base.entity';
import { Address } from 'Modules/Address/Entities/Address.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { label } from '../Model/Label.model';
import { IsNotEmpty, Matches } from 'class-validator';

@Entity()
@Index(['address', 'customer', 'isDefault', 'label'])
export class DeliveryAddress extends BaseEntity<DeliveryAddress> {
  @OneToOne(() => Address, (address) => address.deliveryAddress, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @ManyToOne(() => User, (customer) => customer.deliveryAddress)
  @JoinColumn({ name: 'customer' })
  customer: User;

  @Column({
    name: 'isDefault',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isDefault: boolean;

  @Column({
    name: 'mobile number',
    type: 'varchar',
    nullable: false,
  })
  @IsNotEmpty({ message: 'Mobile number is required' })
  @Matches(/^\d{10}$/, {
    message: 'Mobile number must be exactly 10 digits',
  })
  mobileNumber: string;

  @Column({
    name: 'country code',
    type: 'varchar',
    nullable: false,
  })
  @IsNotEmpty({ message: 'Country code is required' })
  @Matches(/^\+\d{1,4}$/, {
    message: 'Country code must start with "+" and be 1 to 4 digits',
  })
  countryCode: string;

  @Column({ name: 'label', type: 'enum', enum: label, nullable: true })
  label: label;
}

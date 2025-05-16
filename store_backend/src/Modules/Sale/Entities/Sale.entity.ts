import { BaseEntity } from 'Common/Entities/Base.entity';
import { Payment } from 'Modules/Payment/Entities/Payment.entity';
import { Product } from 'Modules/Product/Entities/Product.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

export enum status {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURNED = 'RETURNED',
  FAILED = 'FAILED',
}

@Entity()
@Index(['buyer', 'status'])
export class Sale extends BaseEntity<Sale> {
  @ManyToOne(() => User, (buyer) => buyer.sales, { eager: true })
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @OneToMany(() => Product, (products) => products.sold, { eager: true })
  products: Product[];

  @Column({ name: 'status', type: 'enum', enum: status, nullable: false })
  status: status;

  //Inverse relations
  @OneToOne(() => Payment, (receivedPayment) => receivedPayment.order, {
    onDelete: 'CASCADE',
  })
  receivedPayment: Payment;
}

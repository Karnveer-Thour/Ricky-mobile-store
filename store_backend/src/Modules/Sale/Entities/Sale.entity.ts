import { BaseEntity } from 'Common/Entities/Base.entity';
import { Payment } from 'Modules/Payment/Entities/Payment.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { status } from '../Model/Status.enum';
import { SaleItem } from './SaleItem.entity';

@Entity()
export class Sale extends BaseEntity<Sale> {
  @ManyToOne(() => User, (buyer) => buyer.sales, { eager: true })
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @OneToMany(() => SaleItem, (items) => items.sale, { eager: true, cascade: true })
  products: SaleItem[];

  @Column({ name: 'status', type: 'enum', enum: status, nullable: false })
  status: status;

  //Inverse relations
  @OneToOne(() => Payment, (receivedPayment) => receivedPayment.order, {
    onDelete: 'CASCADE',
  })
  receivedPayment: Payment;
}

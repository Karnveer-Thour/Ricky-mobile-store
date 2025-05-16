import { BaseEntity } from 'Common/Entities/Base.entity';
import { Sale } from 'Modules/Sale/Entities/Sale.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
@Index(['amount', 'message', 'buyer', 'order'])
export class Payment extends BaseEntity<Payment> {
  @Column({ name: 'amount', type: 'numeric', nullable: false })
  amount: number;

  @Column({ name: 'message', type: 'varchar', length: 550, nullable: true })
  message: string;

  @ManyToOne(() => User, (buyer) => buyer, { eager: true })
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @OneToOne(() => Sale, (order) => order.receivedPayment, { eager: true })
  @JoinColumn({ name: 'orderId' })
  order: Sale;
}

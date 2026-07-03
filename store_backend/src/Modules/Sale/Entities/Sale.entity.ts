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

  @Column({ name: 'lender', type: 'varchar', length: 50, nullable: true })
  lender: string;

  @Column({ name: 'tenureMonths', type: 'int', nullable: true })
  tenureMonths: number;

  @Column({ name: 'monthlyInstallment', type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyInstallment: number;

  @Column({ name: 'deliveryOtp', type: 'varchar', length: 10, nullable: true })
  deliveryOtp: string;

  @Column({ name: 'landmark', type: 'text', nullable: true })
  landmark: string;

  @Column({ name: 'riderLat', type: 'decimal', precision: 10, scale: 6, nullable: true })
  riderLat: number;

  @Column({ name: 'riderLng', type: 'decimal', precision: 10, scale: 6, nullable: true })
  riderLng: number;

  @Column({ name: 'riderLocationUpdatedAt', type: 'timestamp', nullable: true })
  riderLocationUpdatedAt: Date;

  //Inverse relations
  @OneToOne(() => Payment, (receivedPayment) => receivedPayment.order, {
    onDelete: 'CASCADE',
  })
  receivedPayment: Payment;
}

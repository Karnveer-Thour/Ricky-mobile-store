import { BaseEntity } from 'Common/Entities/Base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Payment } from './Payment.entity';

export enum EmiStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class EmiDetails extends BaseEntity<EmiDetails> {
  @OneToOne(() => Payment, (payment) => payment.emiDetails)
  payment: Payment;

  @Column({ name: 'provider', type: 'varchar', length: 50, nullable: false })
  provider: string; // 'BAJAJ' | 'HOMECREDIT' | etc.

  @Column({ name: 'tenureMonths', type: 'integer', nullable: false })
  tenureMonths: number;

  @Column({ name: 'interestRate', type: 'decimal', precision: 5, scale: 2, nullable: false })
  interestRate: number;

  @Column({ name: 'monthlyInstallment', type: 'decimal', precision: 10, scale: 2, nullable: false })
  monthlyInstallment: number;

  @Column({ name: 'downPayment', type: 'decimal', precision: 10, scale: 2, default: 0 })
  downPayment: number;

  @Column({ name: 'processingFee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  processingFee: number;

  @Column({
    name: 'approvalStatus',
    type: 'enum',
    enum: EmiStatus,
    default: EmiStatus.PENDING,
  })
  approvalStatus: EmiStatus;

  @Column({ name: 'loanAccountNumber', type: 'varchar', length: 100, nullable: true })
  loanAccountNumber?: string;
}

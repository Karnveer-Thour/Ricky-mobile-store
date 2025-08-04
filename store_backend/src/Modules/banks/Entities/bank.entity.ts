import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'Common/Entities/Base.entity';
import { Payment } from 'Modules/Payment/Entities/Payment.entity';
import { Column, Entity, Index, OneToOne } from 'typeorm';

@Entity()
@Index(['houseNumber', 'streetNumber', 'areaName', 'city', 'pincode', 'district', 'state'])
export class Bank extends BaseEntity<Bank> {
  @Column({
    name: 'accountHolderName',
    type: 'varchar',
    length: '100',
    nullable: false,
  })
  accountHolderName: string;

  @Column({
    name: 'bankName',
    type: 'varchar',
    length: '100',
    nullable: false,
  })
  bankName: string;

  @Column({
    name: 'accountNumber',
    type: 'varchar',
    length: '20',
    nullable: false,
  })
  accountNumber: string;

  @Column({
    name: 'ifscCode',
    type: 'varchar',
    length: '11',
    nullable: false,
  })
  ifscCode: string;

  @Column({
    name: 'branchName',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  branchName?: string;

  // inverse relationships
  @OneToOne(() => Payment, (payment) => payment.bankAccount, {
    onDelete: 'CASCADE',
  })
  receivedPayment: Payment;
}

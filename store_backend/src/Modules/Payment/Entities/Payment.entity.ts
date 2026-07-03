import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'Common/Entities/Base.entity';
import { Bank } from 'Modules/banks/Entities/bank.entity';
import { Sale } from 'Modules/Sale/Entities/Sale.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { EmiDetails } from './EmiDetails.entity';

export enum PaymentMethod {
  CARD = 'CARD',
  UPI = 'UPI',
  EMI_BAJAJ = 'EMI_BAJAJ',
  EMI_HOMECREDIT = 'EMI_HOMECREDIT',
  NETBANKING = 'NETBANKING',
}

@Entity()
@Index(['amount'])
export class Payment extends BaseEntity<Payment> {
  @ApiProperty({
    description: 'Enter payed amount',
    example: '3000',
    type: 'number',
    required: true,
  })
  @Column({ name: 'amount', type: 'numeric', nullable: false })
  amount: number;

  @ApiProperty({
    description: 'Enter any additional note or reason',
    example: 'For grocery',
    type: 'string',
    required: false,
  })
  @Column({ name: 'message', type: 'varchar', length: 550, nullable: true })
  message: string;

  @ApiProperty({
    description: 'Enter payment method',
    example: 'CARD',
    enum: PaymentMethod,
    required: true,
  })
  @Column({
    name: 'paymentMethod',
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CARD,
  })
  paymentMethod: PaymentMethod;

  @OneToOne(() => EmiDetails, (emi) => emi.payment, { cascade: true, nullable: true, eager: true })
  @JoinColumn({ name: 'emiDetailsId' })
  emiDetails?: EmiDetails;

  @ApiProperty({
    description: 'Enter customer Id',
    example: '564646545',
    type: 'string',
    required: true,
  })
  @ManyToOne(() => User, (buyer) => buyer, { eager: true })
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @ApiProperty({
    description: 'Enter Sale Id',
    example: '986485645',
    type: 'string',
    required: true,
  })
  @OneToOne(() => Sale, (order) => order.receivedPayment, { eager: true })
  @JoinColumn({ name: 'orderId' })
  order: Sale;

  @ApiProperty({
    description: 'Enter Payment Id',
    example: '9dsjhs898f',
    type: 'string',
    required: true,
  })
  @OneToOne(() => Bank, (bank) => bank.receivedPayment, { eager: true })
  @JoinColumn({ name: 'bankId' })
  bankAccount: Bank;
}

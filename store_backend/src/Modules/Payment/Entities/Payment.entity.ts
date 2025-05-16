import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'Common/Entities/Base.entity';
import { Sale } from 'Modules/Sale/Entities/Sale.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
@Index(['amount', 'message', 'buyer', 'order'])
export class Payment extends BaseEntity<Payment> {

  @ApiProperty({description:"Enter payed amount",example:"3000",type:'number',required:true})
  @Column({ name: 'amount', type: 'numeric', nullable: false })
  amount: number;

  @ApiProperty({description:"Enter any additional note or reason",example:'For grocery',type:'string',required:false})
  @Column({ name: 'message', type: 'varchar', length: 550, nullable: true })
  message: string;

  @ApiProperty({description:"Enter customer Id",example:"564646545",type:'string',required:true})
  @ManyToOne(() => User, (buyer) => buyer, { eager: true })
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @ApiProperty({description:"Enter Sale Id",example:"986485645",type:'string',required:true})
  @OneToOne(() => Sale, (order) => order.receivedPayment, { eager: true })
  @JoinColumn({ name: 'orderId' })
  order: Sale;
}

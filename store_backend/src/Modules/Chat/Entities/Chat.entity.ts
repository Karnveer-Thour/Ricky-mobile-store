import { BaseEntity } from 'Common/Entities/Base.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Payment } from 'Modules/Payment/Entities/Payment.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

export enum ChatMessageType {
  TEXT = 'TEXT',
  PAYMENT_REQUEST = 'PAYMENT_REQUEST',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
}

@Entity()
@Index(['senderId', 'receiverId'])
export class Chat extends BaseEntity<Chat> {
  @Column({ name: 'message', type: 'text', nullable: true })
  message: string;

  @Column({ name: 'fileUrl', type: 'varchar', length: 255, nullable: true })
  fileUrl: string;

  @Column({
    name: 'messageType',
    type: 'enum',
    enum: ChatMessageType,
    default: ChatMessageType.TEXT,
  })
  messageType: ChatMessageType;

  @ManyToOne(() => Payment, { nullable: true, eager: true })
  @JoinColumn({ name: 'paymentId' })
  payment?: Payment;

  @ManyToOne(() => User, (senderId) => senderId.sendedChats, { eager: true })
  @JoinColumn({ name: 'senderId' })
  senderId: User;

  @ManyToOne(() => User, (receiverId) => receiverId.recievedMessages, {
    eager: true,
  })
  @JoinColumn({ name: 'receiverId' })
  receiverId: string;
}

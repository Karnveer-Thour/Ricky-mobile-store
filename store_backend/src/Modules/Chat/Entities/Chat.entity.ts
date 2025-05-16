import { BaseEntity } from 'Common/Entities/Base.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
@Index(['message', 'fileUrl', 'senderId', 'receiverId'])
export class Chat extends BaseEntity<Chat> {
  @Column({ name: 'message', type: 'text', nullable: true })
  message: string;

  @Column({ name: 'fileUrl', type: 'varchar', length: 255, nullable: true })
  fileUrl: string;

  @ManyToOne(() => User, (senderId) => senderId.sendedChats, { eager: true })
  @JoinColumn({ name: 'senderId' })
  senderId: User;

  @ManyToOne(() => User, (receiverId) => receiverId.recievedMessages, {
    eager: true,
  })
  @JoinColumn({ name: 'receiverId' })
  receiverId: string;
}

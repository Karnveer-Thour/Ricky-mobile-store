import { BaseEntity } from "Common/Entities/Base.entity";
import { User } from "Modules/User/Entities/User.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";

@Entity()
@Index([
    "message",
    "fileUrl",
    "senderId",
    "receiverId",
])
export class Chat extends BaseEntity<Chat> {
    @Column({ name: "message", type: "text", nullable: true })
    message: string;

    @Column({ name: "fileUrl", type: "varchar", length: 255, nullable: true })
    fileUrl: string;

    @ManyToOne(()=>User,senderId=>senderId.sendedChats,{eager:true})
    @Column({ name: "senderId", type: "uuid", nullable: false })
    senderId: User;

    @ManyToOne(()=>User,receiverId=>receiverId.recievedMessages,{eager:true})
    @Column({ name: "receiverId", type: "uuid", nullable: false })
    receiverId: string;
}

import { BaseEntity } from "Common/Entities/Base.entity";
import { Column, Entity, Index } from "typeorm";

export enum userType {
    Admin = "Admin",
    Customer = "Customer",
}

@Entity()
@Index([
    "message",
    "fileUrl",
    "senderId",
    "senderType",
    "receiverId",
    "receiverType",
])
export class Chat extends BaseEntity<Chat> {
    @Column({ name: "message", type: "text", nullable: true })
    message: string;

    @Column({ name: "fileUrl", type: "varchar", length: 255, nullable: true })
    fileUrl: string;

    @Column({ name: "senderId", type: "uuid", nullable: false })
    senderId: string;

    @Column({
        name: "senderType",
        type: "enum",
        enum: userType,
        nullable: false,
    })
    senderType: userType;

    @Column({ name: "receiverId", type: "uuid", nullable: false })
    receiverId: string;

    @Column({
        name: "receiverType",
        type: "enum",
        enum: userType,
        nullable: false,
    })
    receiverType: string;
}

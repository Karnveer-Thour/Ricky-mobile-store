import { BaseEntity } from "Common/Entities/Base.entity";
import { Address } from "Modules/Address/Entities/Address.entity";
import { User } from "Modules/User/Entities/User.entity";
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
} from "typeorm";

export enum label {
    Home = "Home",
    Work = "Work",
}

@Entity()
@Index(["address", "customer", "isDefault", "label"])
export class DeliveryAddress extends BaseEntity<DeliveryAddress> {
    @OneToOne(() => Address, { cascade: true, eager: true })
    @JoinColumn({ name: "addressId" })
    address: Address;

    @ManyToOne(() => User, (customer) => customer.deliveryAddress)
    @JoinColumn({ name: "customer" })
    customer: User;

    @Column({
        name: "isDefault",
        type: "boolean",
        nullable: true,
        default: false,
    })
    isDefault: boolean;

    @Column({ name: "label", type: "enum", enum: label, nullable: true })
    label: label;
}

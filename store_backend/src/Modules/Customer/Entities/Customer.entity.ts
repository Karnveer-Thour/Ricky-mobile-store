import { Exclude, Expose } from "class-transformer";
import { BaseEntity } from "Common/Entities/Base.entity";
import { birthToAge } from "Common/Utils/Utils";
import { Address } from "../../Address/Entities/Address.entity";
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    OneToMany,
    OneToOne,
} from "typeorm";
import { DeliveryAddress } from "Modules/Delivery_address/Entities/DeliveryAddress.entity";

@Entity()
@Index([
    "firstName",
    "lastName",
    "email",
    "mobileNumber",
    "password",
    "dateBirth",
])
export class Customer extends BaseEntity<Customer> {
    @Column({
        name: "firstName",
        type: "varchar",
        length: 25,
        nullable: false,
    })
    firstName: string;

    @Column({
        name: "lastName",
        type: "varchar",
        length: 25,
        nullable: false,
    })
    lastName: string;

    @Column({
        name: "email",
        type: "varchar",
        length: 225,
        nullable: false,
    })
    email: string;

    @Column({
        name: "mobileNumber",
        type: "varchar",
        length: 25,
        nullable: true,
    })
    mobileNumber: string;

    @Column({
        name: "password",
        type: "varchar",
        length: 255,
        nullable: false,
    })
    @Exclude()
    password: string;

    @OneToOne(() => Address, { cascade: true, eager: true })
    @JoinColumn({ name: "addressId" }) // this should match the foreign key column name
    address: Address;

    @Column({ name: "dateBirth", type: "date", nullable: false })
    dateBirth: Date;

    @Expose()
    get age(): number | null {
        return birthToAge(this.dateBirth);
    }

    // Inverse relations
    @OneToMany(() => DeliveryAddress, (delivery) => delivery.customer)
    deliveryAddress: DeliveryAddress[];
}

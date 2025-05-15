import { Exclude, Expose } from "class-transformer";
import { IsDateString, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { BaseEntity } from "Common/Entities/Base.entity";
import { birthToAge } from "Common/Utils/Utils";
import { Address } from "../../Address/Entities/Address.entity";
import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";

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
    @IsString()
    firstName: string;

    @Column({
        name: "lastName",
        type: "varchar",
        length: 25,
        nullable: false,
    })
    @IsString()
    lastName: string;

    @Column({
        name: "email",
        type: "varchar",
        length: 225,
        nullable: false,
    })
    @IsEmail()
    email: string;

    @Column({
        name: "mobileNumber",
        type: "varchar",
        length: 25,
        nullable: true,
    })
    @IsString()
    mobileNumber: string;

    @Column({
        name: "password",
        type: "varchar",
        length: 255,
        nullable: false,
    })
    @Exclude()
    @IsNotEmpty()
    @IsString()
    password: string;

    @OneToOne(() => Address, { cascade: true, eager: true })
    @JoinColumn({ name: "addressId" }) // this should match the foreign key column name
    address: Address;

    @Column({ name: "dateBirth", type: "date", nullable: false })
    @IsDateString()
    dateBirth: Date;

    @Expose()
    get age(): number | null {
        return birthToAge(this.dateBirth);
    }
}

import { Expose } from "class-transformer";
import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BaseEntity } from "Common/Entities/Base.entity";
import { birthToAge } from "Common/Utils/Utils";
import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Address } from "./Address.entity";

@Entity()
@Index([
    "firstName",
    "lastName",
    "email",
    "number",
    "password",
    "dateBirth",
    "age",
])
export class Admin extends BaseEntity<Admin> {
    @Column({
        name: "firstName",
        type: "varchar",
        length: "25",
        nullable: false,
    })
    @IsString()
    firstName: string;

    @Column({
        name: "lastName",
        type: "varchar",
        length: "25",
        nullable: false,
    })
    @IsString()
    lastName: string;

    @Column({ name: "email", type: "varchar", length: "225", nullable: false })
    @IsEmail()
    email: string;

    @Column({ name: "mobileNumber", type: "varchar", length: "25", nullable: true })
    @IsString()
    mobileNumber: string;

    @Column({ name: "password", type: "number", length: "10", nullable: false })
    @IsNotEmpty()
    @IsString()
    password: string;

    @OneToOne(()=>Address,{cascade:true,eager:true})
    @JoinColumn({name:"address"})
    address:string

    @Column({ name: "dateBirth", type: "date", nullable: false })
    @IsDateString()
    dateBirth: Date;

    @Expose()
    get age(): number | null {
    return birthToAge(this.dateBirth);
  }
}

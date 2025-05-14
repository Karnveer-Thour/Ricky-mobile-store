import { IsNumber, IsString } from "class-validator";
import { BaseEntity } from "Common/Entities/Base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class AcceptedCities extends BaseEntity<AcceptedCities> {
    @Column({ name: "city", type: "varchar", length: "30", nullable: true })
    @IsString()
    cityName: string;

    @Column({ name: "pincode", type: "numeric", nullable: true })
    @IsNumber()
    cityPincode: number;

    @Column({ name: "district", type: "varchar", length: "30", nullable: true })
    @IsString()
    district: string;

    @Column({ name: "state", type: "varchar", length: "20", nullable: false })
    @IsString()
    state: string;
}

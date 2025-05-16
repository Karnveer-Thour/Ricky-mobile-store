import { BaseRepository } from "Common/Repositories/Base.repo";
import { Payment } from "../Entities/Payment.entity";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class paymentRepository extends BaseRepository<Payment>{
    constructor(private readonly dataSource:DataSource){
        super(Payment,dataSource);
    }
}
import { BaseRepository } from "Common/Repositories/Base.repo";
import { Sale } from "../Entities/Sale.entity";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class SaleRepository extends BaseRepository<Sale>{
    constructor(private readonly dataSource:DataSource){
        super(Sale,dataSource);
    }
}
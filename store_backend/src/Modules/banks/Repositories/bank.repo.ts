import { BaseRepository } from "Common/Repositories/Base.repo";
import { Bank } from "../Entities/bank.entity";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class BankRepository extends BaseRepository<Bank> {
    constructor(dataSource: DataSource) {
        super(Bank, dataSource);
      }
}
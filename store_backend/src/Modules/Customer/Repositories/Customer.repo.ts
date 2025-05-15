import { BaseRepository } from "Common/Repositories/Base.repo";
import { Customer } from "../Entities/Customer.entity";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class CustomerRepository extends BaseRepository<Customer> {
    constructor(private readonly dataSource: DataSource) {
        super(Customer, dataSource);
    }
}

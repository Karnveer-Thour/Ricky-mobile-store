import { Injectable } from "@nestjs/common";
import { BaseRepository } from "Common/Repositories/Base.repo";
import { Address } from "../Entities/Address.entity";
import { DataSource } from "typeorm";

@Injectable()
export class AdminRepository extends BaseRepository<Address> {
  constructor(dataSource: DataSource) {
    super(Address, dataSource);
  }
}
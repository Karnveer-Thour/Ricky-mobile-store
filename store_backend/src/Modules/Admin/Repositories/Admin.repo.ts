import { Injectable } from "@nestjs/common";
import { BaseRepository } from "Common/Repositories/Base.repo";
import { Admin } from "Modules/Admin/Entities/Admin.entity";
import { DataSource } from "typeorm";

@Injectable()
export class AdminRepository extends BaseRepository<Admin> {
  constructor(dataSource: DataSource) {
    super(Admin, dataSource);
  }
}

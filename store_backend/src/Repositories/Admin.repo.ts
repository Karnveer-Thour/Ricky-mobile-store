import { newDatasource } from "Database/typeORM";
import { Admin } from "Entities/Admin.entity";

export const adminRepo = newDatasource.getRepository(Admin);

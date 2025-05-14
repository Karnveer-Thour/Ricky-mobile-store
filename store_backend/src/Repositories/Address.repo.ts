import { newDatasource } from "Database/typeORM";
import { Address } from "Entities/Address.entity";

export const addressRepo=newDatasource.getRepository(Address);
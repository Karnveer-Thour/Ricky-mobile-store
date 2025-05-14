import { newDatasource } from "Database/typeORM";
import { Address } from "Modules/Address/Entities/Address.entity";

export const addressRepo=newDatasource.getRepository(Address);
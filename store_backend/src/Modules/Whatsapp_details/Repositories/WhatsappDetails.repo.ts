import { BaseRepository } from "Common/Repositories/Base.repo";
import { DataSource } from "typeorm";
import { whatsappDetailsEntity } from "../Entities/WhatsappDetails.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class whatsappDetailsRepository extends BaseRepository<whatsappDetailsEntity>{
    constructor(private readonly dataSource:DataSource){
        super(whatsappDetailsEntity,dataSource);
    }
}
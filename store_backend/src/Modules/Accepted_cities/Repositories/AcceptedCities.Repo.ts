import { BaseRepository } from "Common/Repositories/Base.repo";
import { AcceptedCities } from "../Entities/AcceptedCities.entity";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class AcceptedCitiesRepository extends BaseRepository<AcceptedCities> {
    constructor(private readonly dataSource: DataSource) {
        super(AcceptedCities, dataSource);
    }
}

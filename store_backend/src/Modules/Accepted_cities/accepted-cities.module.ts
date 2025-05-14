import { Module } from '@nestjs/common';
import { AcceptedCitiesRepository } from './Repositories/AcceptedCities.Repo';

@Module({
    providers:[AcceptedCitiesRepository]
})
export class AcceptedCitiesModule {}

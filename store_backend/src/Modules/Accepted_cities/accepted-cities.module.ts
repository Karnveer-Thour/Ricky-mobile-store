import { Module } from '@nestjs/common';
import { AcceptedCitiesService } from './accepted-cities.service';
import { AcceptedCitiesController } from './accepted-cities.controller';
import { AcceptedCities } from './Entities/accepted-cities.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptedCitiesRepository } from './Repositories/accepted-cities.Repo';

@Module({
  imports:[TypeOrmModule.forFeature([AcceptedCities])],
  controllers: [AcceptedCitiesController],
  providers: [AcceptedCitiesService,AcceptedCitiesRepository],
})
export class AcceptedCitiesModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { AcceptedCitiesController } from './accepted-cities.controller';
import { AcceptedCitiesService } from './accepted-cities.service';

describe('AcceptedCitiesController', () => {
  let controller: AcceptedCitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcceptedCitiesController],
      providers: [AcceptedCitiesService],
    }).compile();

    controller = module.get<AcceptedCitiesController>(AcceptedCitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

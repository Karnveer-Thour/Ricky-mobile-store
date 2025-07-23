import { Test, TestingModule } from '@nestjs/testing';
import { AcceptedCitiesService } from './accepted-cities.service';

describe('AcceptedCitiesService', () => {
  let service: AcceptedCitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcceptedCitiesService],
    }).compile();

    service = module.get<AcceptedCitiesService>(AcceptedCitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

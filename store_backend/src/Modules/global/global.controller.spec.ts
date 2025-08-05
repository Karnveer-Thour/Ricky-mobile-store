import { Test, TestingModule } from '@nestjs/testing';
import { GlobalController } from './global.controller';
import { GlobalService } from './global.service';

describe('GlobalController', () => {
  let controller: GlobalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalController],
      providers: [GlobalService],
    }).compile();

    controller = module.get<GlobalController>(GlobalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

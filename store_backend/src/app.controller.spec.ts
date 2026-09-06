import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  const mockHealth = {
    status: 'ok',
    timestamp: '2026-09-06T12:00:00.000Z',
    uptime: 123,
    service: 'ricky-mobile-store-backend',
    memory: {
      rss: '45 MB',
      heapUsed: '25 MB',
      heapTotal: '35 MB',
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue('Hello World!'),
            getHealth: jest.fn().mockReturnValue(mockHealth),
          },
        },
      ],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    it('should return health status object', () => {
      const result = appController.getHealth();
      expect(result).toEqual(mockHealth);
      expect(result.status).toBe('ok');
    });
  });
});

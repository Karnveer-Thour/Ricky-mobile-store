import { SaleRepository } from './Repositories/Sale.repo';
import { AppGateway } from 'Core/Gateways/app.gateway';
import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from './sale.service';

describe('SaleService', () => {
  let service: SaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        { provide: SaleRepository, useValue: { findOne: jest.fn() } },
        { provide: AppGateway, useValue: { server: {} } },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

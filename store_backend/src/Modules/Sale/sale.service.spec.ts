import { SaleRepository } from './Repositories/Sale.repo';
import { SaleItemRepository } from './Repositories/SaleItem.repo';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';
import { ProductColorRepository } from 'Modules/Product/Repositories/ProductColor.repo';
import { AppGateway } from 'Core/Gateways/app.gateway';
import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from './sale.service';

describe('SaleService', () => {
  let service: SaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        { provide: SaleRepository, useValue: { findOne: jest.fn(), save: jest.fn() } },
        { provide: SaleItemRepository, useValue: { save: jest.fn(), create: jest.fn() } },
        { provide: UserRepository, useValue: { findOneBy: jest.fn() } },
        { provide: ProductRepository, useValue: { findOneBy: jest.fn() } },
        { provide: ProductColorRepository, useValue: { findOneBy: jest.fn() } },
        { provide: AppGateway, useValue: { server: {} } },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

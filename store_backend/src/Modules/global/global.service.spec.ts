import { UserRepository } from '../User/Repositories/User.repo';
import { ProductRepository } from '../Product/Repositories/Product.repo';
import { AcceptedCitiesRepository } from '../Accepted_cities/Repositories/accepted-cities.Repo';
import { CategoryRepository } from '../Category/Repositories/Category.repo';
import { whatsappDetailsRepository } from '../Whatsapp_details/Repositories/WhatsappDetails.repo';
import { SaleRepository } from '../Sale/Repositories/Sale.repo';
import { Test, TestingModule } from '@nestjs/testing';
import { GlobalService } from './global.service';

describe('GlobalService', () => {
  let service: GlobalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalService,
        { provide: UserRepository, useValue: { find: jest.fn() } },
        { provide: ProductRepository, useValue: { find: jest.fn() } },
        { provide: AcceptedCitiesRepository, useValue: { find: jest.fn() } },
        { provide: CategoryRepository, useValue: { find: jest.fn() } },
        { provide: whatsappDetailsRepository, useValue: { find: jest.fn() } },
        { provide: SaleRepository, useValue: { find: jest.fn() } }
      ],
    }).compile();

    service = module.get<GlobalService>(GlobalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

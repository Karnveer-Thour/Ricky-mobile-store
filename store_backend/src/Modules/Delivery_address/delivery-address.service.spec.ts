import { DeliveryAddressRepository } from './Repositories/DeliveryAddress.repo';
import { UserRepository } from '../User/Repositories/User.repo';
import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryAddressService } from './delivery-address.service';

describe('DeliveryAddressService', () => {
  let service: DeliveryAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryAddressService,
        { provide: DeliveryAddressRepository, useValue: { find: jest.fn() } },
        { provide: UserRepository, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<DeliveryAddressService>(DeliveryAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

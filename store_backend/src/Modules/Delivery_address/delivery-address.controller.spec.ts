import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryAddressController } from './delivery-address.controller';
import { DeliveryAddressService } from './delivery-address.service';

describe('DeliveryAddressController', () => {
  let controller: DeliveryAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryAddressController],
      providers: [{ provide: DeliveryAddressService, useValue: { create: jest.fn() } }],
    }).compile();

    controller = module.get<DeliveryAddressController>(DeliveryAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

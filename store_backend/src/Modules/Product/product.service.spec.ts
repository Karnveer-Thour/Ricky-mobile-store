import { ProductRepository } from './Repositories/Product.repo';
import { ProductColorRepository } from './Repositories/ProductColor.repo';
import { CategoryRepository } from 'Modules/Category/Repositories/Category.repo';
import { ProductVariantRepository } from './Repositories/ProductVariant.repo';
import { AIService } from 'Modules/AI/ai.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn() } },
        { provide: ProductColorRepository, useValue: { find: jest.fn(), create: jest.fn(), delete: jest.fn() } },
        { provide: ProductVariantRepository, useValue: { find: jest.fn(), create: jest.fn(), delete: jest.fn() } },
        { provide: CategoryRepository, useValue: { findOne: jest.fn() } },
        { provide: AIService, useValue: { enrichProductDetails: jest.fn() } },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

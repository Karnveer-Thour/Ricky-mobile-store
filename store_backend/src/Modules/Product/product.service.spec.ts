import { ProductRepository } from './Repositories/Product.repo';
import { ProductColorRepository } from './Repositories/ProductColor.repo';
import { CategoryRepository } from 'Modules/Category/Repositories/Category.repo';
import { ProductVariantRepository } from './Repositories/ProductVariant.repo';
import { AIService } from 'Modules/AI/ai.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductCsvService } from './Services/product-csv.service';
import { ProductEnrichmentService } from './Services/product-enrichment.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn() },
        },
        {
          provide: ProductColorRepository,
          useValue: { find: jest.fn(), create: jest.fn(), delete: jest.fn() },
        },
        {
          provide: ProductVariantRepository,
          useValue: { find: jest.fn(), create: jest.fn(), delete: jest.fn() },
        },
        { provide: CategoryRepository, useValue: { findOne: jest.fn() } },
        { provide: AIService, useValue: { enrichProductDetails: jest.fn() } },
        { provide: ProductCsvService, useValue: { downloadCSV: jest.fn(), uploadCSV: jest.fn() } },
        {
          provide: ProductEnrichmentService,
          useValue: {
            autoEnrichProductDetails: jest.fn(),
            mapColors: jest.fn(),
            mapVariants: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

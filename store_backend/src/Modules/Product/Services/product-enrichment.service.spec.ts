import { Test, TestingModule } from '@nestjs/testing';
import { ProductEnrichmentService } from './product-enrichment.service';
import { AIService } from 'Modules/AI/ai.service';
import { ProductColorRepository } from '../Repositories/ProductColor.repo';
import { ProductVariantRepository } from '../Repositories/ProductVariant.repo';
import { Category } from 'Modules/Category/Entities/Category.entity';

describe('ProductEnrichmentService', () => {
  let service: ProductEnrichmentService;
  let aiService: any;
  let colorRepo: any;
  let variantRepo: any;

  const mockCategory: Category = {
    id: 1,
    name: 'Smartphones',
    hasColors: true,
    products: [],
  } as any;

  beforeEach(async () => {
    aiService = {
      enrichProductDetails: jest.fn(),
    };
    colorRepo = {
      create: jest.fn((dto) => ({ id: 1, ...dto })),
    };
    variantRepo = {
      create: jest.fn((dto) => ({ id: 1, ...dto })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductEnrichmentService,
        { provide: AIService, useValue: aiService },
        { provide: ProductColorRepository, useValue: colorRepo },
        { provide: ProductVariantRepository, useValue: variantRepo },
      ],
    }).compile();

    service = module.get<ProductEnrichmentService>(ProductEnrichmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('autoEnrichProductDetails', () => {
    it('should not call AI if description, specifications, warranty, and imageUrl are all present', async () => {
      const product = {
        name: 'iPhone 15',
        price: 999,
        description: 'A great smartphone with excellent performance',
        specifications: 'A16 Bionic, 6GB RAM',
        warranty: '1 Year',
        imageUrl: 'https://example.com/phone.jpg',
      } as any;

      const result = await service.autoEnrichProductDetails(product, mockCategory, []);
      expect(result.finalDescription).toBe(product.description);
      expect(result.finalSpecifications).toBe(product.specifications);
      expect(result.finalWarranty).toBe(product.warranty);
      expect(result.finalImageUrl).toBe(product.imageUrl);
      expect(aiService.enrichProductDetails).not.toHaveBeenCalled();
    });

    it('should call AI service and enrich missing fields', async () => {
      aiService.enrichProductDetails.mockResolvedValue({
        description: 'AI description',
        specifications: 'AI specs',
        warranty: '2 Years AI Warranty',
        imageUrl: 'https://example.com/ai.jpg',
        colors: [{ name: 'Silver', quantity: 10 }],
      });

      const product = {
        name: 'Galaxy S24',
        price: 800,
        description: '',
        specifications: '',
        warranty: '',
        imageUrl: '',
      } as any;

      const result = await service.autoEnrichProductDetails(product, mockCategory, []);
      expect(aiService.enrichProductDetails).toHaveBeenCalledWith('Galaxy S24', 'Smartphones', 800);
      expect(result.finalDescription).toBe('AI description');
      expect(result.finalSpecifications).toBe('AI specs');
      expect(result.finalWarranty).toBe('2 Years AI Warranty');
      expect(result.finalImageUrl).toBe('https://example.com/ai.jpg');
      expect(result.calculatedQuantity).toBe(10);
    });

    it('should handle AI service error gracefully and provide fallback description', async () => {
      aiService.enrichProductDetails.mockRejectedValue(new Error('AI Service Down'));

      const product = {
        name: 'Pixel 8',
        price: 700,
        description: '',
        specifications: '',
        warranty: '',
        imageUrl: 'https://example.com/pixel.jpg',
      } as any;

      const result = await service.autoEnrichProductDetails(product, mockCategory, []);
      expect(result.finalDescription).toContain('Pixel 8');
    });
  });

  describe('mapColors', () => {
    it('should map color objects to entities', () => {
      const colors = [
        { name: 'Red', quantity: 5 },
        { name: 'Blue', quantity: 3 },
      ];
      const entities = service.mapColors(colors);
      expect(entities).toHaveLength(2);
      expect(colorRepo.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('mapVariants', () => {
    it('should map variant DTOs to entities', () => {
      const variants = [{ ram: '8GB', storage: '128GB', color: 'Black', quantity: 4 }] as any;
      const entities = service.mapVariants(variants);
      expect(entities).toHaveLength(1);
      expect(variantRepo.create).toHaveBeenCalledWith(variants[0]);
    });
  });
});

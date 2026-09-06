import { Test, TestingModule } from '@nestjs/testing';
import { ProductAuditService } from './product-audit.service';
import { AIEnrichedProduct } from '../Constants/device-presets.constants';

describe('ProductAuditService', () => {
  let service: ProductAuditService;

  const mockAiTarget: AIEnrichedProduct = {
    description:
      'A rich multi-sentence e-commerce description with high detail and selling points.',
    specifications: '• RAM & Storage: 8 GB RAM | 128 GB ROM\n• Processor: High performance chip',
    warranty: '1 Year Official Brand Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab',
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab'],
    colors: [
      { name: 'Black', quantity: 10 },
      { name: 'Blue', quantity: 10 },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductAuditService],
    }).compile();

    service = module.get<ProductAuditService>(ProductAuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should detect missing warranty and flag it', () => {
    const result = service.auditProductDetails(
      {
        name: 'iPhone 15',
        warranty: '',
        description: 'A great phone that delivers exceptional performance.',
        specifications: '• RAM & Storage: 6GB RAM | 128GB ROM with all day battery',
        imageUrl: 'https://images.unsplash.com/photo-valid',
        colors: [
          { name: 'Black', quantity: 5 },
          { name: 'White', quantity: 5 },
        ],
      },
      mockAiTarget,
    );

    expect(result.hasSuggestions).toBe(true);
    expect(result.reasons.some((r) => r.includes('Warranty was unassigned'))).toBe(true);
    expect(result.suggestions.warranty).toBeDefined();
  });

  it('should detect brief descriptions and missing RAM specs', () => {
    const result = service.auditProductDetails(
      {
        name: 'Galaxy Phone',
        warranty: '1 Year Brand Warranty',
        description: 'short desc',
        specifications: 'Fast phone',
        imageUrl: 'https://images.unsplash.com/photo-valid',
        colors: [{ name: 'Black', quantity: 5 }],
      },
      mockAiTarget,
    );

    expect(result.hasSuggestions).toBe(true);
    expect(result.reasons.some((r) => r.includes('Description was too brief'))).toBe(true);
    expect(result.reasons.some((r) => r.includes('Technical specifications lacked'))).toBe(true);
  });

  it('should detect generic default color', () => {
    const result = service.auditProductDetails(
      {
        name: 'OnePlus Phone',
        warranty: '1 Year Brand Warranty',
        description:
          'A rich multi-sentence e-commerce description with high detail and selling points.',
        specifications: '• RAM & Storage: 8 GB RAM | 128 GB ROM with flagship camera',
        imageUrl: 'https://images.unsplash.com/photo-valid',
        colors: [{ name: 'Default', quantity: 15 }],
      },
      mockAiTarget,
    );

    expect(result.hasSuggestions).toBe(true);
    expect(result.reasons.some((r) => r.includes('generic "Default" color'))).toBe(true);
    expect(result.suggestions.colors).toEqual(mockAiTarget.colors);
  });
});

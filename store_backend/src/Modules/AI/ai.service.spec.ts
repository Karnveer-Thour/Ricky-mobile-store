import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from './ai.service';
import { DeviceHeuristicsService } from './Services/device-heuristics.service';
import { LlmProviderService } from './Services/llm-provider.service';
import { ProductAuditService } from './Services/product-audit.service';

describe('AIService', () => {
  let service: AIService;
  let heuristicsService: any;
  let llmService: any;
  let auditService: any;

  const mockProduct = {
    description: 'A great device',
    specifications: 'Specs',
    warranty: '1 Year',
    imageUrl: 'https://example.com/img.jpg',
    images: ['https://example.com/img.jpg'],
    colors: [{ name: 'Black', quantity: 10 }],
  };

  beforeEach(async () => {
    heuristicsService = {
      getOfflineEnrichedProduct: jest.fn().mockReturnValue(mockProduct),
    };
    llmService = {
      callLlmForProductEnrichment: jest.fn(),
      callLlmForCategoryEnrichment: jest.fn(),
    };
    auditService = {
      auditProductDetails: jest.fn().mockReturnValue({
        hasSuggestions: false,
        issuesFound: 0,
        suggestions: {},
        reasons: [],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        { provide: DeviceHeuristicsService, useValue: heuristicsService },
        { provide: LlmProviderService, useValue: llmService },
        { provide: ProductAuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<AIService>(AIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enrichProductDetails', () => {
    it('should return offline presets when product name is empty', async () => {
      const res = await service.enrichProductDetails('');
      expect(res).toEqual(mockProduct);
      expect(llmService.callLlmForProductEnrichment).not.toHaveBeenCalled();
    });

    it('should return LLM response when available', async () => {
      const llmEnriched = { ...mockProduct, description: 'LLM generated desc' };
      llmService.callLlmForProductEnrichment.mockResolvedValue(llmEnriched);

      const res = await service.enrichProductDetails('iPhone 15', 'Smartphones', 999);
      expect(res.description).toBe('LLM generated desc');
    });

    it('should fallback to heuristics when LLM returns null', async () => {
      llmService.callLlmForProductEnrichment.mockResolvedValue(null);

      const res = await service.enrichProductDetails('iPhone 15', 'Smartphones', 999);
      expect(res).toEqual(mockProduct);
    });
  });

  describe('auditProductDetails', () => {
    it('should delegate audit to ProductAuditService', async () => {
      const dto = { name: 'Pixel 8' };
      const res = await service.auditProductDetails(dto);
      expect(auditService.auditProductDetails).toHaveBeenCalled();
      expect(res.hasSuggestions).toBe(false);
    });
  });

  describe('enrichCategoryDetails', () => {
    it('should return category details with mobile heuristics', async () => {
      llmService.callLlmForCategoryEnrichment.mockResolvedValue(null);

      const res = await service.enrichCategoryDetails('Smartphones');
      expect(res.hasColors).toBe(true);
      expect(res.hasVariants).toBe(true);
      expect(res.description).toContain('mobile');
    });
  });
});

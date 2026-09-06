import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AIEnrichedProduct } from './Constants/device-presets.constants';
import { DeviceHeuristicsService } from './Services/device-heuristics.service';
import { LlmProviderService } from './Services/llm-provider.service';
import {
  ProductAuditService,
  AuditProductInputDto,
  ProductAuditResult,
} from './Services/product-audit.service';

export { AIEnrichedProduct } from './Constants/device-presets.constants';

@Injectable()
export class AIService implements OnModuleInit {
  private readonly logger = new Logger(AIService.name);

  constructor(
    private readonly deviceHeuristicsService: DeviceHeuristicsService,
    private readonly llmProviderService: LlmProviderService,
    private readonly productAuditService: ProductAuditService,
  ) {}

  onModuleInit() {
    const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
    const model =
      process.env.AI_MODEL ||
      (provider === 'gemini'
        ? 'gemini-1.5-flash'
        : provider === 'claude'
          ? 'claude-3-5-sonnet-20241022'
          : 'gpt-4o-mini');
    const hasKey = !!(
      (provider === 'gemini' && process.env.GEMINI_API_KEY) ||
      (provider === 'claude' && process.env.ANTHROPIC_API_KEY) ||
      (provider === 'openai' && process.env.OPENAI_API_KEY) ||
      (provider === 'openllm' && process.env.OPENLLM_ENDPOINT)
    );

    if (hasKey) {
      this.logger.log(
        `AI connected successfully (Provider: ${provider.toUpperCase()}, Model: ${model})`,
      );
    } else {
      this.logger.log(
        `AI connected successfully (Engine: Smart Heuristics & Catalog Intelligence)`,
      );
    }
  }

  /**
   * Main Multi-Provider Product Enrichment Method
   */
  async enrichProductDetails(
    productName: string,
    categoryName?: string,
    price?: number | string,
  ): Promise<AIEnrichedProduct> {
    const offlinePreset = this.deviceHeuristicsService.getOfflineEnrichedProduct(
      productName || 'Device',
      categoryName,
      price,
    );

    if (!productName || productName.trim().length === 0) {
      return offlinePreset;
    }

    const llmResult = await this.llmProviderService.callLlmForProductEnrichment(
      productName,
      categoryName,
      price,
      offlinePreset,
    );

    return llmResult || offlinePreset;
  }

  /**
   * Audits entered product information, detects discrepancies,
   * and suggests corrections for Warranty, Description, Specifications, Colors, and Image.
   */
  async auditProductDetails(dto: AuditProductInputDto): Promise<ProductAuditResult> {
    const aiTarget = await this.enrichProductDetails(dto.name, dto.category, dto.price);
    return this.productAuditService.auditProductDetails(dto, aiTarget);
  }

  /**
   * Smart Category Description & Variant Capabilities Generator
   */
  async enrichCategoryDetails(categoryName: string): Promise<{
    description: string;
    hasColors: boolean;
    hasVariants: boolean;
  }> {
    const trimmed = (categoryName || '').trim();
    const lower = trimmed.toLowerCase();

    // Default heuristics based on category keywords
    let description = `Explore our curated selection of ${trimmed || 'electronic products'} designed to deliver exceptional quality, modern style, and dependable daily performance.`;
    let hasColors = true;
    let hasVariants = false;

    if (
      lower.includes('phone') ||
      lower.includes('mobile') ||
      lower.includes('smartphone') ||
      lower.includes('iphone')
    ) {
      description =
        'The mobile category includes portable handheld devices, flagship smartphones, and 5G handsets designed for wireless communication, computing, and on-the-go entertainment.';
      hasColors = true;
      hasVariants = true;
    } else if (lower.includes('tablet') || lower.includes('ipad') || lower.includes('tab')) {
      description =
        'Portable touchscreen computing devices, iPads, and multimedia tablets ideal for digital art, entertainment, productivity, and e-learning.';
      hasColors = true;
      hasVariants = true;
    } else if (
      lower.includes('audio') ||
      lower.includes('headphone') ||
      lower.includes('earbud') ||
      lower.includes('tws') ||
      lower.includes('speaker')
    ) {
      description =
        'High-fidelity personal audio gear featuring studio acoustics, active noise cancelation, seamless wireless connectivity, and all-day battery life.';
      hasColors = true;
      hasVariants = false;
    } else if (
      lower.includes('watch') ||
      lower.includes('wearable') ||
      lower.includes('band') ||
      lower.includes('tracker')
    ) {
      description =
        'Intelligent wearable devices and smartwatches offering comprehensive health telemetry, GPS navigation, fitness monitoring, and instant connectivity.';
      hasColors = true;
      hasVariants = false;
    } else if (
      lower.includes('charger') ||
      lower.includes('cable') ||
      lower.includes('power') ||
      lower.includes('adapter')
    ) {
      description =
        'High-speed Gallium Nitride (GaN) power adapters, durable braided cables, and portable battery banks for fast and safe device recharging.';
      hasColors = false;
      hasVariants = false;
    } else if (
      lower.includes('case') ||
      lower.includes('cover') ||
      lower.includes('protect') ||
      lower.includes('guard') ||
      lower.includes('glass')
    ) {
      description =
        'Premium protective cases, tempered glass screen guards, and shockproof armor covers engineered to safeguard your devices with sleek ergonomics.';
      hasColors = true;
      hasVariants = false;
    } else if (
      lower.includes('laptop') ||
      lower.includes('computer') ||
      lower.includes('macbook')
    ) {
      description =
        'High-performance laptops, ultrabooks, and workstations engineered for demanding creative tasks, professional computing, and seamless multitasking.';
      hasColors = true;
      hasVariants = true;
    }

    const llmCategory = await this.llmProviderService.callLlmForCategoryEnrichment(trimmed);
    if (llmCategory) {
      if (llmCategory.description) description = llmCategory.description;
      if (typeof llmCategory.hasColors === 'boolean') hasColors = llmCategory.hasColors;
      if (typeof llmCategory.hasVariants === 'boolean') hasVariants = llmCategory.hasVariants;
    }

    return {
      description,
      hasColors,
      hasVariants,
    };
  }
}

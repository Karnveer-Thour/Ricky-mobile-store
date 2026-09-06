import { Injectable } from '@nestjs/common';
import { AIEnrichedProduct } from '../Constants/device-presets.constants';

export interface AuditProductInputDto {
  name: string;
  category?: string;
  price?: number | string;
  description?: string;
  specifications?: string;
  warranty?: string;
  imageUrl?: string;
  colors?: Array<{ name: string; quantity: number }>;
}

export interface ProductAuditResult {
  hasSuggestions: boolean;
  issuesFound: number;
  suggestions: Partial<AIEnrichedProduct>;
  reasons: string[];
}

@Injectable()
export class ProductAuditService {
  /**
   * Audits entered product information against the AI baseline target,
   * detects discrepancies, and provides suggested improvements.
   */
  auditProductDetails(dto: AuditProductInputDto, aiTarget: AIEnrichedProduct): ProductAuditResult {
    const reasons: string[] = [];
    const suggestions: Partial<AIEnrichedProduct> = {};
    const lowerName = (dto.name || '').toLowerCase();

    // 1. Audit Warranty
    const currentWarranty = (dto.warranty || '').trim();
    if (!currentWarranty || currentWarranty === 'No Warranty / As-Is') {
      suggestions.warranty = aiTarget.warranty;
      reasons.push(
        `Warranty was unassigned. Standard official coverage is "${aiTarget.warranty}".`,
      );
    } else if (
      (lowerName.includes('iphone') || lowerName.includes('apple')) &&
      !currentWarranty.toLowerCase().includes('apple')
    ) {
      suggestions.warranty =
        '1 Year Official Apple Brand Warranty for Device and 6 Months for In-Box Accessories';
      reasons.push(
        `Apple devices qualify for "1 Year Official Apple Brand Warranty" with in-box accessory coverage.`,
      );
    } else if (
      (lowerName.includes('charger') || lowerName.includes('case')) &&
      currentWarranty.toLowerCase().includes('year')
    ) {
      suggestions.warranty = '6 Months Official Accessories Warranty';
      reasons.push(`Accessories typically carry "6 Months Official Accessories Warranty".`);
    }

    // 2. Audit Specifications & Description
    const currentDesc = (dto.description || '').trim();
    const currentSpecs = (dto.specifications || '').trim();

    if (!currentSpecs || currentSpecs.length < 50 || !currentSpecs.includes('RAM')) {
      suggestions.specifications = aiTarget.specifications;
      reasons.push(
        `Technical specifications lacked Flipkart-style structured details (RAM, Storage, Processor, Display, Cameras).`,
      );
    }

    if (!currentDesc || currentDesc.length < 35 || currentDesc.toLowerCase().includes('details')) {
      suggestions.description = aiTarget.description;
      reasons.push(`Description was too brief. Suggested complete e-commerce marketing overview.`);
    }

    // 3. Audit Image
    const currentImg = (dto.imageUrl || '').trim();
    if (!currentImg || currentImg.includes('products/file.png') || !currentImg.startsWith('http')) {
      suggestions.imageUrl = aiTarget.imageUrl;
      suggestions.images = aiTarget.images;
      reasons.push(
        `Product was missing high-definition multi-angle imagery. Suggested multi-angle photo gallery.`,
      );
    }

    // 4. Audit Colors
    const currentColors = dto.colors || [];
    if (
      currentColors.length <= 1 &&
      (currentColors[0]?.name === 'Default' || currentColors[0]?.name === 'Standard') &&
      aiTarget.colors.length > 1
    ) {
      suggestions.colors = aiTarget.colors;
      reasons.push(
        `Product had only a generic "Default" color. Suggested official device colorways (${aiTarget.colors
          .map((c) => c.name)
          .join(', ')}).`,
      );
    }

    const issuesFound = reasons.length;
    const hasSuggestions = issuesFound > 0;

    return {
      hasSuggestions,
      issuesFound,
      suggestions,
      reasons,
    };
  }
}

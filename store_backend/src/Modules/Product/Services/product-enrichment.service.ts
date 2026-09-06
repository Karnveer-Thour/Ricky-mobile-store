import { Injectable } from '@nestjs/common';
import { AIService } from 'Modules/AI/ai.service';
import { ProductColorRepository } from '../Repositories/ProductColor.repo';
import { ProductVariantRepository } from '../Repositories/ProductVariant.repo';
import { CreateProductDto } from '../Dtos/create-product.dto';
import { Category } from 'Modules/Category/Entities/Category.entity';
import { ProductColor } from '../Entities/ProductColor.entity';
import { ProductVariant } from '../Entities/ProductVariant.entity';

@Injectable()
export class ProductEnrichmentService {
  constructor(
    private readonly aiService: AIService,
    private readonly productColorRepository: ProductColorRepository,
    private readonly productVariantRepository: ProductVariantRepository,
  ) {}

  async autoEnrichProductDetails(
    productData: CreateProductDto,
    category: Category,
    incomingColors: any[],
  ) {
    let finalDescription = productData.description;
    let finalSpecifications = productData.specifications;
    let finalWarranty = productData.warranty;
    let finalImageUrl = productData.imageUrl;
    let finalColors = incomingColors;
    let calculatedQuantity = 0;

    const isDescMissing =
      !finalDescription ||
      finalDescription.trim() === '' ||
      finalDescription.trim().toLowerCase() === `${productData.name.toLowerCase()} details` ||
      finalDescription.trim().toLowerCase() === 'details';

    if (!finalImageUrl || isDescMissing || !finalWarranty || !finalSpecifications) {
      try {
        const aiEnriched = await this.aiService.enrichProductDetails(
          productData.name,
          category.name,
          productData.price,
        );
        if (!finalImageUrl && aiEnriched.imageUrl) {
          finalImageUrl = aiEnriched.imageUrl;
        }
        if (isDescMissing && aiEnriched.description) {
          finalDescription = aiEnriched.description;
        }
        if (!finalSpecifications && aiEnriched.specifications) {
          finalSpecifications = aiEnriched.specifications;
        }
        if (!finalWarranty && aiEnriched.warranty) {
          finalWarranty = aiEnriched.warranty;
        }
        if (category.hasColors !== false && !finalColors.length && aiEnriched.colors?.length) {
          finalColors = aiEnriched.colors as any;
          calculatedQuantity = finalColors.reduce(
            (acc: number, curr: any) => acc + (Number(curr.quantity) || 0),
            0,
          );
        }
      } catch (e) {
        console.warn('Backend AI auto-enrichment warning:', e);
        if (isDescMissing) {
          finalDescription = `Experience high-performance technology with the ${productData.name}. Designed with precision hardware, immersive display, and all-day battery life.`;
        }
      }
    }

    return {
      finalDescription,
      finalSpecifications,
      finalWarranty,
      finalImageUrl,
      finalColors,
      calculatedQuantity,
    };
  }

  mapColors(colors: any[]): ProductColor[] {
    return (colors || []).map((c) =>
      this.productColorRepository.create({
        name: c.name,
        quantity: Number(c.quantity) || 0,
      }),
    );
  }

  mapVariants(variants: any[]): ProductVariant[] {
    return (variants || []).map((v) =>
      this.productVariantRepository.create({
        ram: v.ram || null,
        storage: v.storage || null,
        color: v.color || null,
        quantity: Number(v.quantity) || 0,
      }),
    );
  }
}

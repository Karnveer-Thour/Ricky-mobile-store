import { Body, Controller, Post } from '@nestjs/common';
import { AIService } from './ai.service';
import { EnrichProductDto } from './dto/enrich-product.dto';
import { AuditProductDto } from './dto/audit-product.dto';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('enrich-product')
  async enrichProduct(@Body() body: EnrichProductDto) {
    const enriched = await this.aiService.enrichProductDetails(
      body.name,
      body.category,
      body.price,
    );
    return {
      status: true,
      message: 'Product details enriched successfully by AI',
      data: enriched,
    };
  }

  @Post('audit-product')
  async auditProduct(@Body() body: AuditProductDto) {
    const auditResult = await this.aiService.auditProductDetails(body);
    return {
      status: true,
      message: auditResult.hasSuggestions
        ? `AI found ${auditResult.issuesFound} potential improvements`
        : 'All product fields look consistent and high quality',
      data: auditResult,
    };
  }
}

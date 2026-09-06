import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { DeviceHeuristicsService } from './Services/device-heuristics.service';
import { LlmProviderService } from './Services/llm-provider.service';
import { ProductAuditService } from './Services/product-audit.service';

@Module({
  controllers: [AIController],
  providers: [AIService, DeviceHeuristicsService, LlmProviderService, ProductAuditService],
  exports: [AIService],
})
export class AIModule {}

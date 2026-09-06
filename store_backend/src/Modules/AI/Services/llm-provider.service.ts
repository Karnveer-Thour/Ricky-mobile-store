import { Injectable, Logger } from '@nestjs/common';
import { AIEnrichedProduct } from '../Constants/device-presets.constants';

@Injectable()
export class LlmProviderService {
  private readonly logger = new Logger(LlmProviderService.name);

  /**
   * Dispatches product enrichment request to configured remote LLM provider
   */
  async callLlmForProductEnrichment(
    productName: string,
    categoryName?: string,
    price?: number | string,
    offlinePreset?: AIEnrichedProduct,
  ): Promise<AIEnrichedProduct | null> {
    const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
    const geminiKey = process.env.GEMINI_API_KEY || '';
    const claudeKey = process.env.ANTHROPIC_API_KEY || '';
    const openaiKey = process.env.OPENAI_API_KEY || '';
    const openllmEndpoint = process.env.OPENLLM_ENDPOINT || '';

    // 1. Google Gemini Provider
    if (provider === 'gemini' && geminiKey) {
      try {
        const model = process.env.AI_MODEL || 'gemini-1.5-flash';
        const prompt = `You are an expert e-commerce mobile & electronics specialist like Flipkart/Amazon.
Given the product name: "${productName}", Category: "${categoryName || 'Smartphones'}", Price: "${price || 'Competitive'}".
Generate complete Flipkart-style technical specifications (RAM, Storage, Processor, Display, Cameras, Battery, OS, In-The-Box) and engaging marketing description.
Return ONLY valid JSON matching this exact structure:
{
  "description": "Engaging 2-3 sentences e-commerce overview highlighting key selling points",
  "specifications": "• RAM & Storage: ...\\n• Processor: ...\\n• Display: ...\\n• Rear Camera: ...\\n• Front Camera: ...\\n• Battery & Charging: ...\\n• OS & Connectivity: ...\\n• In The Box: ...",
  "warranty": "1 Year Official Brand Warranty for Device and 6 Months for In-Box Accessories",
  "colors": [
    {"name": "ColorName1", "quantity": 15},
    {"name": "ColorName2", "quantity": 10}
  ]
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          },
        );

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              description: parsed.description || offlinePreset?.description || '',
              specifications: parsed.specifications || offlinePreset?.specifications || '',
              warranty: parsed.warranty || offlinePreset?.warranty || '',
              imageUrl: offlinePreset?.imageUrl || '',
              images: offlinePreset?.images || [],
              colors:
                parsed.colors && Array.isArray(parsed.colors) && parsed.colors.length > 0
                  ? parsed.colors
                  : offlinePreset?.colors || [],
            };
          }
        }
      } catch (err) {
        this.logger.warn(`Gemini API error, falling back to heuristics: ${err}`);
      }
    }

    // 2. Anthropic Claude Provider
    if (provider === 'claude' && claudeKey) {
      try {
        const model = process.env.AI_MODEL || 'claude-3-5-sonnet-20241022';
        const prompt = `Generate Flipkart-style product specifications, description, warranty, and colorways for "${productName}". Output JSON: {"description": "...", "specifications": "...", "warranty": "...", "colors": [{"name": "...", "quantity": 10}]}.`;

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': claudeKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model,
            max_tokens: 700,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data?.content?.[0]?.text;
          if (content) {
            const parsed = JSON.parse(content);
            return {
              description: parsed.description || offlinePreset?.description || '',
              specifications: parsed.specifications || offlinePreset?.specifications || '',
              warranty: parsed.warranty || offlinePreset?.warranty || '',
              imageUrl: offlinePreset?.imageUrl || '',
              images: offlinePreset?.images || [],
              colors: parsed.colors || offlinePreset?.colors || [],
            };
          }
        }
      } catch (err) {
        this.logger.warn(`Claude API error, falling back to heuristics: ${err}`);
      }
    }

    // 3. OpenAI / OpenLLM Provider
    if ((provider === 'openai' && openaiKey) || (provider === 'openllm' && openllmEndpoint)) {
      try {
        const endpoint =
          provider === 'openai'
            ? 'https://api.openai.com/v1/chat/completions'
            : `${openllmEndpoint}/chat/completions`;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (openaiKey) headers['Authorization'] = `Bearer ${openaiKey}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: process.env.AI_MODEL || 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'You are an electronics specialist. Return JSON: { description, specifications, warranty, colors: [{ name, quantity }] }',
              },
              { role: 'user', content: `Product: ${productName}` },
            ],
            response_format: { type: 'json_object' },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            return {
              description: parsed.description || offlinePreset?.description || '',
              specifications: parsed.specifications || offlinePreset?.specifications || '',
              warranty: parsed.warranty || offlinePreset?.warranty || '',
              imageUrl: offlinePreset?.imageUrl || '',
              images: offlinePreset?.images || [],
              colors: parsed.colors || offlinePreset?.colors || [],
            };
          }
        }
      } catch (err) {
        this.logger.warn(`OpenAI/OpenLLM error, falling back to heuristics: ${err}`);
      }
    }

    return null;
  }

  /**
   * Generates AI category description & capabilities via Gemini
   */
  async callLlmForCategoryEnrichment(
    trimmedCategory: string,
  ): Promise<{ description?: string; hasColors?: boolean; hasVariants?: boolean } | null> {
    const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
    const geminiKey = process.env.GEMINI_API_KEY || '';

    if (provider === 'gemini' && geminiKey && trimmedCategory) {
      try {
        const model = process.env.AI_MODEL || 'gemini-1.5-flash';
        const prompt = `You are an expert e-commerce catalog copywriter.
Category Name: "${trimmedCategory}".
Generate a concise, engaging, professional e-commerce category description (1-2 sentences, max 200 characters). Also decide boolean hasColors (whether products typically come in multiple colors) and hasVariants (whether products typically have RAM/Storage tiers).
Return ONLY valid JSON matching:
{
  "description": "...",
  "hasColors": true,
  "hasVariants": false
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          },
        );

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            return JSON.parse(rawText);
          }
        }
      } catch (err) {
        this.logger.warn(`Gemini category AI error, using heuristics: ${err}`);
      }
    }

    return null;
  }
}

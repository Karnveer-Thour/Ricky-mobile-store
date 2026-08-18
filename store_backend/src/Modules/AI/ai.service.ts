import { Injectable, Logger } from '@nestjs/common';

export interface AIEnrichedProduct {
  description: string;
  specifications: string;
  warranty: string;
  imageUrl: string;
  images: string[];
  colors: Array<{ name: string; quantity: number }>;
}

const DEVICE_IMAGE_PRESETS: Record<string, string[]> = {
  iphone_pro: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1695048133149-c1674488344e?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop&auto=format',
  ],
  iphone: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop&auto=format',
  ],
  samsung_ultra: [
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop&auto=format',
  ],
  samsung: [
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop&auto=format',
  ],
  oneplus: [
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop&auto=format',
  ],
  xiaomi: [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop&auto=format',
  ],
  google_pixel: [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop&auto=format',
  ],
  tablet: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop&auto=format',
  ],
  headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop&auto=format',
  ],
  watch: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop&auto=format',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop&auto=format',
  ],
  generic_phone: [
    'https://res.cloudinary.com/dszgssbnh/image/upload/v1786969670/products/file.png',
  ],
};

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  /**
   * Smart Device Catalog Heuristics with Flipkart-Style Specs & Multi-Image Gallery
   */
  private getOfflineEnrichedProduct(
    name: string,
    category?: string,
    price?: number | string,
  ): AIEnrichedProduct {
    const lower = (name || '').toLowerCase();

    let matchedImages = DEVICE_IMAGE_PRESETS.generic_phone;
    let description = `${name} is engineered for exceptional performance, featuring high-speed processing, stunning vibrant visuals, studio-grade imaging, and long-lasting all-day battery life.`;
    let warranty = '1 Year Official Brand Warranty for Device and 6 Months for In-Box Accessories';
    let specifications = `• RAM & Storage: 8 GB RAM | 128 GB ROM\n• Processor: Octa-Core High Performance Processor\n• Display: 6.67 inch Full HD+ 120Hz AMOLED Display\n• Rear Camera: 50MP (OIS) + 8MP (Ultra-Wide) Dual Camera\n• Front Camera: 16MP Selfie Camera\n• Battery & Charging: 5000 mAh Battery with 67W Fast Turbo Charge\n• OS: Android 14 with 5G Dual SIM Support\n• In The Box: Handset, Power Adapter, USB-C Cable, SIM Ejector, Protective Case`;

    let colors: Array<{ name: string; quantity: number }> = [{ name: 'Default', quantity: 15 }];

    // 1. Apple iPhone Ecosystem
    if (lower.includes('iphone') || lower.includes('apple')) {
      warranty =
        '1 Year Official Apple Brand Warranty for Device and 6 Months for In-Box Accessories';
      if (lower.includes('pro') || lower.includes('max')) {
        matchedImages = DEVICE_IMAGE_PRESETS.iphone_pro;
        description = `Forged in aerospace-grade titanium, ${name} features the groundbreaking A17 Pro / A18 Pro Bionic chip, customizable Action button, the most versatile iPhone camera system with 5x optical telephoto zoom, and Super Retina XDR display with ProMotion 120Hz.`;
        specifications = `• RAM & Storage: 8 GB RAM | 256 GB NVMe High-Speed Storage\n• Processor: Apple A17 Pro (3nm Hexa-Core) with 6-Core Pro GPU & Hardware Ray Tracing\n• Display: 6.7 inch Super Retina XDR OLED Display (120Hz ProMotion, 2000 nits Peak, Always-On, Ceramic Shield)\n• Rear Camera: 48MP (OIS Quad-Pixel) + 12MP (5x Telephoto) + 12MP (Ultra-Wide with Macro) with 4K ProRes Video\n• Front Camera: 12MP TrueDepth Camera with Autofocus & Face ID\n• Battery & Charging: Up to 29 Hours Video Playback with MagSafe 15W Wireless Charging & USB-C 3.0\n• OS: iOS 17 / iOS 18 with Apple Intelligence Support\n• In The Box: iPhone, USB-C Charge Cable (1m), Documentation`;
        colors = [
          { name: 'Natural Titanium', quantity: 15 },
          { name: 'Titanium Black', quantity: 15 },
          { name: 'Titanium White', quantity: 10 },
          { name: 'Titanium Blue', quantity: 10 },
        ];
      } else {
        matchedImages = DEVICE_IMAGE_PRESETS.iphone;
        description = `${name} brings Dynamic Island, 48MP Main camera with 2x Telephoto, durable color-infused glass and aluminum design, and USB-C connectivity with all-day battery life.`;
        specifications = `• RAM & Storage: 6 GB RAM | 128 GB NVMe Storage\n• Processor: Apple A16 Bionic (5-Core GPU)\n• Display: 6.1 inch Super Retina XDR OLED Display (Dynamic Island, HDR10, 2000 nits)\n• Rear Camera: 48MP Main + 12MP Ultra-Wide Dual Camera System\n• Front Camera: 12MP TrueDepth Camera with 4K Dolby Vision\n• Battery: All-day battery life with 20W Fast Charging & 15W MagSafe\n• OS: iOS 17 / iOS 18 with satellite Emergency SOS\n• In The Box: iPhone, USB-C Charge Cable, Documentation`;
        colors = [
          { name: 'Midnight Black', quantity: 15 },
          { name: 'Starlight White', quantity: 12 },
          { name: 'Deep Blue', quantity: 8 },
          { name: 'Light Green', quantity: 5 },
        ];
      }
    }
    // 2. Samsung Galaxy
    else if (lower.includes('samsung') || lower.includes('galaxy')) {
      warranty = '1 Year Official Samsung India Warranty for Handset and 6 Months for Accessories';
      if (lower.includes('ultra') || lower.includes('s24') || lower.includes('s23')) {
        matchedImages = DEVICE_IMAGE_PRESETS.samsung_ultra;
        description = `Welcome to the era of Galaxy AI. ${name} features a durable titanium frame, integrated S-Pen stylus, 200MP quad-telephoto camera system with Nightography zoom, and the ultra-bright Dynamic AMOLED 2X flat display.`;
        specifications = `• RAM & Storage: 12 GB LPDDR5X RAM | 512 GB UFS 4.0 Storage\n• Processor: Snapdragon 8 Gen 3 for Galaxy (4nm Octa-Core up to 3.39 GHz)\n• Display: 6.8 inch Quad HD+ Dynamic AMOLED 2X (1-120Hz LTPO, 2600 nits, Corning Gorilla Armor)\n• Rear Camera: 200MP (OIS) + 50MP (5x Periscope) + 10MP (3x Telephoto) + 12MP (Ultra-Wide) with 100x Space Zoom\n• Front Camera: 12MP Dual-Pixel Autofocus Selfie Camera\n• Battery & Charging: 5000 mAh Battery with 45W Fast Charging & 15W Wireless PowerShare\n• OS: Android 14 / One UI 6.1 with 7 Years of OS & Security Updates\n• In The Box: Handset, S-Pen Stylus, Data Cable (Type-C to Type-C), SIM Ejector Pin`;
        colors = [
          { name: 'Titanium Gray', quantity: 15 },
          { name: 'Titanium Black', quantity: 12 },
          { name: 'Titanium Violet', quantity: 8 },
          { name: 'Titanium Yellow', quantity: 5 },
        ];
      } else {
        matchedImages = DEVICE_IMAGE_PRESETS.samsung;
        description = `${name} combines a vibrant 120Hz Super AMOLED display, high-resolution multi-lens camera with OIS, 5000mAh long-lasting battery, and Knox defense-grade security.`;
        specifications = `• RAM & Storage: 8 GB RAM | 256 GB Storage (Expandable up to 1 TB)\n• Processor: Exynos 1480 / Snapdragon Octa-Core Processor\n• Display: 6.6 inch Full HD+ Super AMOLED 120Hz Display\n• Rear Camera: 50MP (OIS) + 12MP (Ultra-Wide) + 5MP (Macro) Triple Camera\n• Front Camera: 32MP High-Res Selfie Camera\n• Battery & Charging: 5000 mAh Battery with 25W Fast Charging\n• OS: Android 14 with IP67 Water and Dust Resistance\n• In The Box: Handset, USB Type-C Cable, Ejection Pin, Quick Guide`;
        colors = [
          { name: 'Awesome Navy', quantity: 15 },
          { name: 'Awesome Iceblue', quantity: 12 },
          { name: 'Awesome Lilac', quantity: 8 },
        ];
      }
    }
    // 3. OnePlus
    else if (lower.includes('oneplus')) {
      warranty = '1 Year OnePlus Official Warranty for Phone and 6 Months for In-Box Charger';
      matchedImages = DEVICE_IMAGE_PRESETS.oneplus;
      description = `${name} delivers pure flagship speed, 4th Gen Hasselblad Camera for Mobile, 2K 120Hz ProXDR display, Dual Cryo-velocity VC cooling, and ultra-fast 100W SUPERVOOC charging.`;
      specifications = `• RAM & Storage: 16 GB LPDDR5X RAM | 512 GB UFS 4.0 ROM\n• Processor: Snapdragon 8 Gen 3 (4nm) with Adreno 750 GPU\n• Display: 6.82 inch 2K 120Hz ProXDR LTPO 4.0 AMOLED Display (4500 nits Peak)\n• Rear Camera: 50MP Sony LYT-808 (OIS) + 64MP 3x Periscope Telephoto + 48MP Ultra-Wide\n• Front Camera: 32MP 4K Video Selfie Camera\n• Battery & Charging: 5400 mAh Battery with 100W SUPERVOOC Fast Charge (1-100% in 26 mins)\n• OS: OxygenOS 14 based on Android 14\n• In The Box: Handset, 100W SUPERVOOC Power Adapter, Type-C Cable, Quick Guide, SIM Tray Ejector`;
      colors = [
        { name: 'Flowy Emerald', quantity: 15 },
        { name: 'Silky Black', quantity: 15 },
        { name: 'Cool Blue', quantity: 8 },
      ];
    }
    // 4. Xiaomi / Redmi
    else if (lower.includes('redmi') || lower.includes('xiaomi') || lower.includes('poco')) {
      warranty = '1 Year Xiaomi Official Warranty for Handset and 6 Months for In-Box Adapter';
      matchedImages = DEVICE_IMAGE_PRESETS.xiaomi;
      description = `${name} brings 200MP ultra-clear camera with OIS, 1.5K 120Hz curved AMOLED eye-care display, high-speed 5G connectivity, and 67W / 120W Turbo Charging.`;
      specifications = `• RAM & Storage: 8 GB RAM | 256 GB UFS 3.1 Storage\n• Processor: MediaTek Dimensity 7200-Ultra / Snapdragon 7s Gen 2 (4nm Octa-Core)\n• Display: 6.67 inch 1.5K 120Hz CrystalRes 3D Curved AMOLED Display (1800 nits, Dolby Vision)\n• Rear Camera: 200MP Samsung ISOCELL HP3 (OIS) + 8MP Ultra-Wide + 2MP Macro\n• Front Camera: 16MP In-Display Front Camera\n• Battery & Charging: 5000 mAh Battery with 67W / 120W Turbo Charge (In-Box Charger)\n• OS: Xiaomi HyperOS / MIUI based on Android 14 (IP68 Water Resistant)\n• In The Box: Handset, 67W Power Adapter, USB Type-C Cable, SIM Eject Tool, Protective Case`;
      colors = [
        { name: 'Midnight Black', quantity: 15 },
        { name: 'Glacier Blue', quantity: 12 },
        { name: 'Aurora Green', quantity: 8 },
      ];
    }
    // 5. Google Pixel
    else if (lower.includes('pixel') || lower.includes('google')) {
      warranty = '1 Year Google Hardware Limited Warranty';
      matchedImages = DEVICE_IMAGE_PRESETS.google_pixel;
      description = `${name} is engineered by Google with the powerful Tensor G3/G4 chip, revolutionary AI photo capabilities like Best Take and Magic Editor, and up to 7 years of Pixel drops.`;
      specifications = `• RAM & Storage: 12 GB LPDDR5X RAM | 256 GB UFS 3.1 Storage\n• Processor: Google Tensor G3 with Titan M2 Security Coprocessor\n• Display: 6.7 inch Super Actua LTPO OLED Display (1-120Hz, 2400 nits)\n• Rear Camera: 50MP Octa PD (OIS) + 48MP Quad PD Telephoto (5x) + 48MP Ultra-Wide with Macro Focus\n• Front Camera: 10.5MP Dual PD Selfie Camera with Autofocus\n• Battery & Charging: 5050 mAh Battery with 30W Fast Charging & Qi Wireless Charging\n• OS: Android 14 with 7 Years of Feature Drops & Security Updates\n• In The Box: Pixel Smartphone, 1m USB-C to USB-C Cable, Quick Switch Adapter, SIM Tool`;
      colors = [
        { name: 'Obsidian Black', quantity: 15 },
        { name: 'Porcelain White', quantity: 12 },
        { name: 'Bay Blue', quantity: 8 },
      ];
    }
    // 6. Tablets / iPads
    else if (
      lower.includes('pad') ||
      lower.includes('tablet') ||
      (category && category.toLowerCase().includes('tablet'))
    ) {
      warranty = '1 Year Official Manufacturer Warranty';
      matchedImages = DEVICE_IMAGE_PRESETS.tablet;
      description = `${name} features an expansive high-resolution Retina display, pro-level multitasking processing, magnetic stylus pencil support, and quad stereo speakers.`;
      specifications = `• RAM & Storage: 8 GB RAM | 256 GB High-Speed Storage\n• Processor: Apple M2 / Snapdragon Octa-Core Chipset\n• Display: 11 inch Liquid Retina IPS Display (True Tone, 500 nits, ProMotion)\n• Camera: 12MP Wide Rear Camera & 12MP Ultra-Wide Front Camera with Center Stage\n• Battery: Up to 10 Hours Web Surfing & Video Playback\n• Connectivity: Wi-Fi 6E, Bluetooth 5.3, USB-C Port\n• In The Box: Tablet, USB-C Charge Cable, 20W USB-C Power Adapter`;
      colors = [
        { name: 'Space Gray', quantity: 10 },
        { name: 'Silver', quantity: 10 },
      ];
    }
    // 7. Headphones / Earbuds / Audio
    else if (
      lower.includes('headphone') ||
      lower.includes('earbud') ||
      lower.includes('sony') ||
      lower.includes('airpods') ||
      lower.includes('boat') ||
      (category && category.toLowerCase().includes('audio'))
    ) {
      warranty = '1 Year Official Brand Warranty';
      matchedImages = DEVICE_IMAGE_PRESETS.headphones;
      description = `${name} delivers studio-grade acoustics with Industry-Leading Active Noise Cancelation (ANC), speak-to-chat transparency, and up to 30 hours of high-fidelity listening.`;
      specifications = `• Audio Drivers: 30mm Precision Engineered Carbon Fiber Drivers\n• Noise Cancelation: Integrated Processor V1 + HD Noise Canceling Processor QN1 with 8 Microphones\n• Battery Life: 30 Hours with ANC ON (3 min charge gives 3 hours playback)\n• Connectivity: Bluetooth 5.2, LDAC High-Res Audio, Multipoint 2-Device Connection\n• Microphone: 4 Beamforming Mics with AI Noise Reduction\n• In The Box: Headphone, Carrying Case, 3.5mm Audio Cable (1.2m), USB-C Charging Cable`;
      colors = [
        { name: 'Carbon Black', quantity: 15 },
        { name: 'Platinum Silver', quantity: 10 },
      ];
    }
    // 8. Smartwatches
    else if (
      lower.includes('watch') ||
      lower.includes('band') ||
      (category && category.toLowerCase().includes('watch'))
    ) {
      warranty = '1 Year Official Manufacturer Warranty';
      matchedImages = DEVICE_IMAGE_PRESETS.watch;
      description = `${name} offers 24/7 advanced wellness telemetry (ECG, Heart Rate, SpO2, Sleep Stages), precision dual-frequency GPS, and Always-On crystal AMOLED touch display.`;
      specifications = `• Display: 1.43 inch Always-On Sapphire Crystal AMOLED Display (1000 nits)\n• Sensors: Optical Heart Rate, Blood Oxygen (SpO2), ECG, Barometer, Temperature\n• Battery Life: Up to 5 Days in Smart Mode / 14 Days in Power Saver\n• Water Resistance: 50m Water Resistance (5 ATM + IP68)\n• Tracking: 120+ Sports Modes with Automatic Workout Detection\n• In The Box: Smartwatch, Magnetic Fast Charging Dock, Quick Start Guide`;
      colors = [
        { name: 'Black Silicone', quantity: 15 },
        { name: 'Silver Metal', quantity: 10 },
      ];
    }
    // 9. Chargers & Cases
    else if (lower.includes('charger') || lower.includes('cable') || lower.includes('case')) {
      warranty = '6 Months Official Accessories Warranty';
      matchedImages = DEVICE_IMAGE_PRESETS.accessories;
      description = `${name} engineered with premium flame-retardant materials, Gallium Nitride (GaN) fast thermal dissipation, and certified surge protection.`;
      specifications = `• Power Output: 65W / 120W GaN Fast Charging with Power Delivery 3.0 & PPS\n• Ports: Dual USB Type-C + USB Type-A\n• Protection: Over-voltage, Over-current, Short-circuit, and Temperature Control\n• In The Box: Power Adapter, 100W Braided Type-C to Type-C Cable (1.5m), Warranty Card`;
      colors = [
        { name: 'Black', quantity: 25 },
        { name: 'Transparent Clear', quantity: 20 },
      ];
    }

    return {
      description,
      specifications,
      warranty,
      imageUrl: matchedImages[0],
      images: matchedImages,
      colors,
    };
  }

  /**
   * Main Multi-Provider Product Enrichment Method
   */
  async enrichProductDetails(
    productName: string,
    categoryName?: string,
    price?: number | string,
  ): Promise<AIEnrichedProduct> {
    if (!productName || productName.trim().length === 0) {
      return this.getOfflineEnrichedProduct('Device', categoryName, price);
    }

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
          const data = (await res.json()) as any;
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const offlinePreset = this.getOfflineEnrichedProduct(productName, categoryName, price);
            return {
              description: parsed.description || offlinePreset.description,
              specifications: parsed.specifications || offlinePreset.specifications,
              warranty: parsed.warranty || offlinePreset.warranty,
              imageUrl: offlinePreset.imageUrl,
              images: offlinePreset.images,
              colors:
                parsed.colors && Array.isArray(parsed.colors) && parsed.colors.length > 0
                  ? parsed.colors
                  : offlinePreset.colors,
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
          const data = (await res.json()) as any;
          const content = data?.content?.[0]?.text;
          if (content) {
            const parsed = JSON.parse(content);
            const offlinePreset = this.getOfflineEnrichedProduct(productName, categoryName, price);
            return {
              description: parsed.description || offlinePreset.description,
              specifications: parsed.specifications || offlinePreset.specifications,
              warranty: parsed.warranty || offlinePreset.warranty,
              imageUrl: offlinePreset.imageUrl,
              images: offlinePreset.images,
              colors: parsed.colors || offlinePreset.colors,
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
          const data = (await res.json()) as any;
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            const offlinePreset = this.getOfflineEnrichedProduct(productName, categoryName, price);
            return {
              description: parsed.description || offlinePreset.description,
              specifications: parsed.specifications || offlinePreset.specifications,
              warranty: parsed.warranty || offlinePreset.warranty,
              imageUrl: offlinePreset.imageUrl,
              images: offlinePreset.images,
              colors: parsed.colors || offlinePreset.colors,
            };
          }
        }
      } catch (err) {
        this.logger.warn(`OpenAI/OpenLLM error, falling back to heuristics: ${err}`);
      }
    }

    // 4. Default / Smart Device Catalog Heuristics Fallback (Instant, Zero Latency)
    return this.getOfflineEnrichedProduct(productName, categoryName, price);
  }

  /**
   * Audits entered product information, detects discrepancies,
   * and suggests corrections for Warranty, Description, Specifications, Colors, and Image.
   */
  async auditProductDetails(dto: {
    name: string;
    category?: string;
    price?: number | string;
    description?: string;
    specifications?: string;
    warranty?: string;
    imageUrl?: string;
    colors?: Array<{ name: string; quantity: number }>;
  }) {
    const aiTarget = await this.enrichProductDetails(dto.name, dto.category, dto.price);

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

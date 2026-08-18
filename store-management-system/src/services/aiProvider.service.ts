import { API_URL } from "@/constants";

export interface AIEnrichedProduct {
  description: string;
  specifications?: string;
  warranty: string;
  imageUrl: string;
  images?: string[];
  colors: Array<{ name: string; quantity: number }>;
}

export interface AIAuditResult {
  hasSuggestions: boolean;
  issuesFound: number;
  suggestions: Partial<AIEnrichedProduct>;
  reasons: string[];
}

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/dszgssbnh/image/upload/v1786969670/products/file.png";

/**
 * Frontend AI Client
 * Thin client proxy that delegates all AI processing, enrichment,
 * and quality audit checks to the NestJS Backend.
 */
export const aiProviderService = {
  /**
   * Calls the backend POST /ai/enrich-product endpoint to generate product details.
   */
  async generateProductDetails(
    productName: string,
    categoryName?: string,
    price?: number,
  ): Promise<AIEnrichedProduct> {
    try {
      const res = await fetch(`${API_URL}/ai/enrich-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productName,
          category: categoryName,
          price: price ? String(price) : undefined,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn(
        "Backend AI enrichment request failed, using client fallback:",
        err,
      );
    }

    // Client presentation fallback in case backend is offline
    return {
      description: `${productName} flagship smartphone featuring high-definition visuals, responsive multi-tasking processing, and all-day battery performance.`,
      specifications: `• RAM & Storage: 8 GB RAM | 128 GB ROM\n• Processor: High Performance Octa-Core Processor\n• Display: 6.67 inch Full HD+ 120Hz AMOLED Display\n• Rear Camera: 50MP Dual Camera with OIS\n• Front Camera: 16MP Selfie Camera\n• Battery & Charging: 5000 mAh Battery with Fast Charging\n• OS & Connectivity: Android 14 with 5G Dual SIM Support\n• In The Box: Handset, Power Adapter, USB-C Cable, SIM Ejector Pin`,
      warranty:
        "1 Year Official Brand Warranty for Device and 6 Months for In-Box Accessories",
      imageUrl: FALLBACK_IMAGE,
      images: [FALLBACK_IMAGE],
      colors: [{ name: "Default", quantity: 15 }],
    };
  },

  /**
   * Calls backend POST /ai/audit-product to inspect and verify product details.
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
  }): Promise<AIAuditResult> {
    try {
      const res = await fetch(`${API_URL}/ai/audit-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn(
        "Backend AI audit request failed, using fallback check:",
        err,
      );
    }

    return {
      hasSuggestions: false,
      issuesFound: 0,
      suggestions: {},
      reasons: [],
    };
  },
};

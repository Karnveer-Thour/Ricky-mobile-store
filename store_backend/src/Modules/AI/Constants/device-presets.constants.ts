export interface AIEnrichedProduct {
  description: string;
  specifications: string;
  warranty: string;
  imageUrl: string;
  images: string[];
  colors: Array<{ name: string; quantity: number }>;
}

export const DEVICE_IMAGE_PRESETS: Record<string, string[]> = {
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

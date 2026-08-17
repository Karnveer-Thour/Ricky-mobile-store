import { ENV_CONFIG } from '../constants';

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

export interface DashboardProduct {
  id: string | number;
  productName: string;
  price: number;
  stockCount: number;
  category?: string;
  brand?: string;
}

export const productService = {
  async fetchProducts(page = 1, limit = 10, search = ''): Promise<DashboardProduct[]> {
    try {
      const url = new URL(`${API_BASE_URL}/product`);
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));
      if (search) url.searchParams.append('searchText', search);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resData = await response.json();
      const list =
        resData.data?.products ||
        resData.data?.transformedProducts ||
        (Array.isArray(resData.data) ? resData.data : []);
      return Array.isArray(list) ? list : [];
    } catch (err) {
      console.warn('Backend API connection offline, fallback to local state', err);
      return [];
    }
  },

  async getProductById(id: string | number): Promise<any | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resData = await response.json();
      return resData.data ?? null;
    } catch (err) {
      console.warn(`Failed to fetch product ${id}`, err);
      return null;
    }
  },

  // ✅ Fixed: POST /product/create (was /product)
  async createProduct(productData: any): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/product/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const resData = await response.json().catch(() => ({}));
      return { ok: response.ok, message: resData?.message };
    } catch (err) {
      console.warn('Failed to create product via API', err);
      return { ok: false, message: 'Network error. Please try again.' };
    }
  },

  // ✅ Fixed: PATCH /product/:id (was PUT /product/:id)
  async updateProduct(
    id: string | number,
    productData: any,
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const resData = await response.json().catch(() => ({}));
      return { ok: response.ok, message: resData?.message };
    } catch (err) {
      console.warn(`Failed to update product ${id} via API`, err);
      return { ok: false, message: 'Network error. Please try again.' };
    }
  },

  async deleteProduct(id: string | number): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: 'DELETE',
      });
      const resData = await response.json().catch(() => ({}));
      return { ok: response.ok, message: resData?.message };
    } catch (err) {
      console.warn(`Failed to delete product ${id} via API`, err);
      return { ok: false, message: 'Network error. Please try again.' };
    }
  },

  async downloadProductsCSV(): Promise<Blob | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/product/download-csv`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.blob();
    } catch (err) {
      console.warn('Failed to download CSV from backend API', err);
      return null;
    }
  },
};

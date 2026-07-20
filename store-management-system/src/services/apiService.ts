const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface DashboardProduct {
  id: string | number;
  productName: string;
  price: number;
  stockCount: number;
  category?: string;
  brand?: string;
}

export const adminApiService = {
  async fetchProducts(page = 1, limit = 10, search = ''): Promise<DashboardProduct[]> {
    try {
      const url = new URL(`${API_BASE_URL}/product`);
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));
      if (search) url.searchParams.append('searchText', search);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resData = await response.json();
      return resData.data?.products || resData.data || [];
    } catch (err) {
      console.warn('Backend API connection offline, fallback to local state', err);
      return [];
    }
  },

  async updateRiderLocation(orderId: string, lat: number, lng: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/location`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      });
      return response.ok;
    } catch (err) {
      console.warn(`Failed to update rider location for order ${orderId}`, err);
      return false;
    }
  },

  async updateOrderStatus(orderId: string, status: string, otp?: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, otp }),
      });
      return response.ok;
    } catch (err) {
      console.warn(`Failed to update order status for order ${orderId}`, err);
      return false;
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

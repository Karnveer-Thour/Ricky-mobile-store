const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ProductResponse {
  statusCode: number;
  data: {
    products?: any[];
    data?: any[];
    total?: number;
    page?: number;
  } | any;
  message?: string;
}

export const apiService = {
  async fetchProducts(page = 1, limit = 12, searchText = ''): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/product`);
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));
      if (searchText) url.searchParams.append('searchText', searchText);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data?.products || resData.data || resData || [];
    } catch (err) {
      console.warn('Backend API unavailable, using local product catalog.', err);
      return [];
    }
  },

  async fetchProductById(id: string): Promise<any | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || resData;
    } catch (err) {
      console.warn(`Failed to fetch product ${id} from API`, err);
      return null;
    }
  },

  async fetchRiderLocation(orderId: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/location`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || resData;
    } catch (err) {
      console.warn(`Failed to fetch location for order ${orderId}`, err);
      return null;
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
      console.warn(`Failed to update status for order ${orderId}`, err);
      return false;
    }
  },
};

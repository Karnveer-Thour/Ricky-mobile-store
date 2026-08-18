import { ENV_CONFIG } from '../constants';

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

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
  async uploadImage(file: File, folder = 'storefront'): Promise<{ status: boolean; url?: string; message?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const url = new URL(`${API_BASE_URL}/upload/image`);
      if (folder) url.searchParams.append('folder', folder);

      const response = await fetch(url.toString(), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status HTTP ${response.status}`);
      }

      const resData = await response.json();
      return {
        status: true,
        url: resData.data?.url,
      };
    } catch (err: any) {
      console.warn('Image upload failed:', err);
      return {
        status: false,
        message: err.message || 'Image upload failed',
      };
    }
  },

  async fetchProducts(page = 1, limit = 12, searchText = ''): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/product`);
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));
      if (searchText) url.searchParams.append('searchText', searchText);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return (
        resData.data?.products ||
        resData.data?.transformedProducts ||
        (Array.isArray(resData.data) ? resData.data : []) ||
        []
      );
    } catch (err) {
      console.warn('Failed to fetch products from backend API:', err);
      return [];
    }
  },

  async fetchProductById(id: string): Promise<any | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data?.product || resData.data || resData || null;
    } catch (err) {
      console.warn(`Failed to fetch product ${id} from API`, err);
      return null;
    }
  },

  async fetchCategories(page = 1, limit = 50, searchText = ''): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/category`);
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));
      if (searchText) url.searchParams.append('searchText', searchText);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return (
        resData.data?.transformedCategories ||
        resData.data?.categories ||
        (Array.isArray(resData.data) ? resData.data : []) ||
        []
      );
    } catch (err) {
      console.warn('Failed to fetch categories from API', err);
      return [];
    }
  },

  async fetchProductReviews(productId: string): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/product-review`);
      url.searchParams.append('productId', productId);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || resData || [];
    } catch (err) {
      console.warn(`Failed to fetch reviews for product ${productId}`, err);
      return [];
    }
  },

  async submitProductReview(reviewData: { productId: string; rating: number; reviewText: string; userName?: string }): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/product-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      return response.ok;
    } catch (err) {
      console.warn('Failed to submit product review', err);
      return false;
    }
  },

  async checkBajajEligibility(mobile: string, otp: string, amount: number): Promise<{ approved: boolean; limit: number; tenure_options: number[] } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/banks/bajaj/eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp, amount }),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || resData;
    } catch (err) {
      console.warn('Failed to check Bajaj eligibility via API', err);
      return null;
    }
  },

  async checkHomeCreditEligibility(mobile: string, otp: string, amount: number): Promise<{ approved: boolean; limit: number; tenure_options: number[] } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/banks/homecredit/eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp, amount }),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || resData;
    } catch (err) {
      console.warn('Failed to check Home Credit eligibility via API', err);
      return null;
    }
  },

  async globalSearch(query: string): Promise<any> {
    try {
      const url = new URL(`${API_BASE_URL}/global/search`);
      url.searchParams.append('query', query);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || resData;
    } catch (err) {
      console.warn('Global search API failed', err);
      return null;
    }
  },

  async loginUser(email: string, password: string): Promise<{ success: boolean; token?: string; user?: any; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const resData = await response.json();
      if (!response.ok) return { success: false, message: resData.message || 'Login failed' };
      return {
        success: true,
        token: resData.data?.token || resData.token,
        user: resData.data?.user || resData.user,
      };
    } catch (err: any) {
      console.warn('User login API failed', err);
      return { success: false, message: err.message || 'Login failed' };
    }
  },

  async registerUser(userData: any): Promise<{ success: boolean; token?: string; user?: any; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const resData = await response.json();
      if (!response.ok) return { success: false, message: resData.message || 'Registration failed' };
      return {
        success: true,
        token: resData.data?.token || resData.token,
        user: resData.data?.user || resData.user,
      };
    } catch (err: any) {
      console.warn('User registration API failed', err);
      return { success: false, message: err.message || 'Registration failed' };
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

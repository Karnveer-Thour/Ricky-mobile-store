import { ENV_CONFIG } from '../constants';

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

export const orderService = {
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
};

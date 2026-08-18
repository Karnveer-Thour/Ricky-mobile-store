import { ENV_CONFIG } from "../constants";

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

export const customerService = {
  async fetchCustomers(page = 1, limit = 50, search = ""): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/user`);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));
      if (search) url.searchParams.append("searchText", search);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resData = await response.json();
      const rawList =
        resData.data?.transformedCustomers ||
        resData.data?.users ||
        resData.data?.customers ||
        (Array.isArray(resData.data) ? resData.data : []);

      const list = Array.isArray(rawList) ? rawList : [];
      return list.map((item: any) => ({
        ...item,
        name:
          item.name ||
          `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
          item.email,
        id: item._id || item.id,
      }));
    } catch (err) {
      console.warn("Failed to fetch customers via API", err);
      return [];
    }
  },

  async createCustomer(customerData: {
    firstName?: string;
    name?: string;
    lastName?: string;
    email: string;
    password?: string;
    role?: string;
    mobileNumber?: string;
  }): Promise<{ ok: boolean; message?: string }> {
    try {
      const firstName = customerData.firstName || customerData.name || "";
      const lastName = customerData.lastName || "User";
      const password = customerData.password || "Customer@123";
      const role = customerData.role || "Customer";

      const payload: Record<string, any> = {
        firstName,
        lastName,
        email: customerData.email,
        password,
        role,
        dateBirth: (customerData as any).dateBirth || "2000-01-01",
      };

      if (customerData.mobileNumber) {
        payload.mobileNumber = customerData.mobileNumber;
      }

      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json().catch(() => ({}));
      const errorMessage = Array.isArray(resData?.message)
        ? resData.message.join(", ")
        : resData?.message;

      return { ok: response.ok, message: errorMessage };
    } catch (err) {
      console.warn("Failed to create customer via API", err);
      return { ok: false, message: "Network error. Please try again." };
    }
  },

  async updateCustomer(
    id: string | number,
    customerData: any,
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      const payload: Record<string, any> = {};
      if (customerData.firstName || customerData.name) {
        payload.firstName = customerData.firstName || customerData.name;
      }
      if (customerData.lastName) {
        payload.lastName = customerData.lastName;
      }
      if (customerData.email) {
        payload.email = customerData.email;
      }
      if (customerData.mobileNumber) {
        payload.mobileNumber = customerData.mobileNumber;
      }

      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json().catch(() => ({}));
      const errorMessage = Array.isArray(resData?.message)
        ? resData.message.join(", ")
        : resData?.message;

      return { ok: response.ok, message: errorMessage };
    } catch (err) {
      console.warn(`Failed to update customer ${id} via API`, err);
      return { ok: false, message: "Network error. Please try again." };
    }
  },

  async deleteCustomer(
    id: string | number,
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: "DELETE",
      });
      const resData = await response.json().catch(() => ({}));
      const errorMessage = Array.isArray(resData?.message)
        ? resData.message.join(", ")
        : resData?.message;

      return { ok: response.ok, message: errorMessage };
    } catch (err) {
      console.warn(`Failed to delete customer ${id} via API`, err);
      return { ok: false, message: "Network error. Please try again." };
    }
  },
};

import { ENV_CONFIG } from "../constants";

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

export interface ProductResponse {
  statusCode: number;
  data:
    | {
        products?: any[];
        data?: any[];
        total?: number;
        page?: number;
      }
    | any;
  message?: string;
}

export const apiService = {
  async fetchAuthConfig(): Promise<{
    googleClientId: string;
    isGoogleConfigured: boolean;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/auth/config`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || { googleClientId: "", isGoogleConfigured: false };
    } catch {
      return { googleClientId: "", isGoogleConfigured: false };
    }
  },

  async uploadImage(
    file: File,
    folder = "storefront",
  ): Promise<{ status: boolean; url?: string; message?: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = new URL(`${API_BASE_URL}/upload/image`);
      if (folder) url.searchParams.append("folder", folder);

      const response = await fetch(url.toString(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Upload failed with status HTTP ${response.status}`,
        );
      }

      const resData = await response.json();
      return {
        status: true,
        url: resData.data?.url,
      };
    } catch (err: any) {
      console.warn("Image upload failed:", err);
      return {
        status: false,
        message: err.message || "Image upload failed",
      };
    }
  },

  async fetchProducts(page = 1, limit = 12, searchText = ""): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/product`);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));
      if (searchText) url.searchParams.append("searchText", searchText);

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
      console.warn("Failed to fetch products from backend API:", err);
      return [];
    }
  },

  async fetchProductById(id: string): Promise<any | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data?.data || resData.data?.product || resData.data || resData || null;
    } catch (err) {
      console.warn(`Failed to fetch product ${id} from API`, err);
      return null;
    }
  },

  async fetchCategories(page = 1, limit = 50, searchText = ""): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/category`);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));
      if (searchText) url.searchParams.append("searchText", searchText);

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
      console.warn("Failed to fetch categories from API", err);
      return [];
    }
  },

  async fetchProductReviews(productId: string): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/product-review`);
      url.searchParams.append("productId", productId);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || resData || [];
    } catch (err) {
      console.warn(`Failed to fetch reviews for product ${productId}`, err);
      return [];
    }
  },

  async submitProductReview(reviewData: {
    productId: string;
    rating: number;
    reviewText: string;
    userName?: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/product-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      return response.ok;
    } catch (err) {
      console.warn("Failed to submit product review", err);
      return false;
    }
  },

  async checkBajajEligibility(
    mobile: string,
    otp: string,
    amount: number,
  ): Promise<{
    approved: boolean;
    limit: number;
    tenure_options: number[];
  } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/banks/bajaj/eligibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp, amount }),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || resData;
    } catch (err) {
      console.warn("Failed to check Bajaj eligibility via API", err);
      return null;
    }
  },

  async checkHomeCreditEligibility(
    mobile: string,
    otp: string,
    amount: number,
  ): Promise<{
    approved: boolean;
    limit: number;
    tenure_options: number[];
  } | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/banks/homecredit/eligibility`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile, otp, amount }),
        },
      );
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || resData;
    } catch (err) {
      console.warn("Failed to check Home Credit eligibility via API", err);
      return null;
    }
  },

  async globalSearch(query: string): Promise<any> {
    try {
      const url = new URL(`${API_BASE_URL}/global/search`);
      url.searchParams.append("query", query);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || resData;
    } catch (err) {
      console.warn("Global search API failed", err);
      return null;
    }
  },

  async loginUser(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "Customer" }),
      });
      const resData = await response.json();
      if (!response.ok)
        return { success: false, message: resData.message || "Login failed" };
      return {
        success: true,
        token: resData.data?.token || resData.token,
        user: resData.data?.user || resData.user,
      };
    } catch (err: any) {
      console.warn("User login API failed", err);
      return { success: false, message: err.message || "Login failed" };
    }
  },

  async registerUser(userData: any): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const resData = await response.json();
      if (!response.ok)
        return {
          success: false,
          message: resData.message || "Registration failed",
        };
      return {
        success: true,
        token: resData.data?.token || resData.token,
        user: resData.data?.user || resData.user,
      };
    } catch (err: any) {
      console.warn("User registration API failed", err);
      return { success: false, message: err.message || "Registration failed" };
    }
  },

  async loginWithSocial(token: string): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    message?: string;
  }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/login/social/${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const resData = await response.json();
      if (!response.ok)
        return {
          success: false,
          message: resData.message || "Social login failed",
        };
      return {
        success: true,
        token: resData.data?.token || resData.token,
        user: resData.data?.user || resData.user || null,
      };
    } catch (err: any) {
      console.warn("Social login API failed", err);
      return { success: false, message: err.message || "Social login failed" };
    }
  },

  async updateUserProfile(
    userId: string,
    userData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      mobileNumber?: string;
      pictureUrl?: string;
      dateBirth?: string;
      houseNumber?: string;
      streetNumber?: string;
      areaName?: string;
      city?: string;
      pincode?: number;
      district?: string;
      state?: string;
    },
  ): Promise<{ status: boolean; message?: string; data?: any }> {
    try {
      let token = "";
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          token = window.localStorage.getItem("rms_token") || "";
        }
      } catch {
        // ignore
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Sanitize payload: omit empty dateBirth or undefined/null values
      const cleanData: Record<string, any> = {};
      for (const [key, val] of Object.entries(userData)) {
        if (val !== undefined && val !== null) {
          if (key === "dateBirth" && (val === "" || val === "Invalid Date")) {
            continue;
          }
          cleanData[key] = val;
        }
      }

      const response = await fetch(
        `${API_BASE_URL}/user/${encodeURIComponent(userId)}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(cleanData),
        },
      );

      const resData = await response.json();
      if (!response.ok) {
        const errorMsg = Array.isArray(resData.message)
          ? resData.message.join(", ")
          : resData.message || `Update failed with status ${response.status}`;
        return {
          status: false,
          message: errorMsg,
        };
      }

      return {
        status: true,
        message: resData.data?.message || "User updated successfully.",
        data: resData.data,
      };
    } catch (err: any) {
      console.warn("Update user profile API failed", err);
      return {
        status: false,
        message: err.message || "Failed to update profile",
      };
    }
  },

  async fetchRiderLocation(
    orderId: string,
  ): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/location`,
      );
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || resData;
    } catch (err) {
      console.warn(`Failed to fetch location for order ${orderId}`, err);
      return null;
    }
  },

  async updateOrderStatus(
    orderId: string,
    status: string,
    otp?: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, otp }),
      });
      return response.ok;
    } catch (err) {
      console.warn(`Failed to update status for order ${orderId}`, err);
      return false;
    }
  },

  // ── Pincode & Delivery Serviceability (Accepted Cities) ───────────────

  async fetchAcceptedCities(
    page = 1,
    limit = 20,
    searchText = "",
  ): Promise<{
    status: boolean;
    cities: any[];
    total: number;
  }> {
    try {
      const url = new URL(`${API_BASE_URL}/accepted-cities`);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));
      if (searchText) url.searchParams.append("searchText", searchText);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return {
        status: true,
        cities: resData.data?.transformedCities || resData.data || [],
        total: resData.data?.total || 0,
      };
    } catch (err) {
      console.warn("Failed to fetch accepted cities from API", err);
      return { status: false, cities: [], total: 0 };
    }
  },

  async checkPincodeAvailability(pincode: string): Promise<{
    isAvailable: boolean;
    isAccepting: boolean;
    cityName?: string;
    district?: string;
    state?: string;
    backendVerified: boolean;
    message: string;
  }> {
    try {
      const cleanPin = pincode.trim().replace(/\D/g, "");
      if (cleanPin.length !== 6) {
        return {
          isAvailable: false,
          isAccepting: false,
          backendVerified: false,
          message: "Please enter a valid 6-digit pincode.",
        };
      }

      const response = await fetch(
        `${API_BASE_URL}/accepted-cities/check/${cleanPin}`,
      );
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();

      const data = resData.data;
      if (data && data.available) {
        return {
          isAvailable: true,
          isAccepting: true,
          cityName: data.cityName,
          district: data.district,
          state: data.state,
          backendVerified: true,
          message: data.message || "Yes, it is available for delivery",
        };
      }

      return {
        isAvailable: false,
        isAccepting: false,
        cityName: data?.cityName,
        district: data?.district,
        state: data?.state,
        backendVerified: true,
        message: data?.message || "City not available for delivery",
      };
    } catch (err) {
      console.warn("Check pincode API failed:", err);
      return {
        isAvailable: false,
        isAccepting: false,
        backendVerified: false,
        message: "City not available for delivery",
      };
    }
  },

  // ── Delivery Address Management ──────────────────────────────────────

  async fetchDeliveryAddresses(
    userId?: string,
    page = 1,
    limit = 20,
  ): Promise<{
    status: boolean;
    addresses: any[];
    total: number;
  }> {
    try {
      const url = new URL(`${API_BASE_URL}/delivery-address`);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));
      if (userId) {
        url.searchParams.append("userId", userId);
      }

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return {
        status: true,
        addresses: resData.data?.deliveryAddresses || resData.data || [],
        total: resData.data?.total || 0,
      };
    } catch (err) {
      console.warn("Failed to fetch delivery addresses from API", err);
      return { status: false, addresses: [], total: 0 };
    }
  },

  async createDeliveryAddress(addressData: {
    customerId: string;
    houseNumber: string;
    streetNumber: string;
    areaName: string;
    city: string;
    pincode: number;
    district: string;
    state: string;
    countryCode?: string;
    mobileNumber: string;
    label?: "Home" | "Work";
    isDefault?: boolean;
  }): Promise<{
    status: boolean;
    data?: any;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/delivery-address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...addressData,
          countryCode: addressData.countryCode || "+91",
          label: addressData.label || "Home",
          isDefault: addressData.isDefault ?? true,
        }),
      });
      const resData = await response.json();
      if (!response.ok) {
        return {
          status: false,
          message: resData.message || "Failed to create delivery address",
        };
      }
      return {
        status: true,
        data: resData.data,
      };
    } catch (err: any) {
      console.warn("Create delivery address API failed", err);
      return {
        status: false,
        message: err.message || "Failed to create delivery address",
      };
    }
  },

  async updateDeliveryAddress(
    id: string,
    addressData: any,
  ): Promise<{
    status: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/delivery-address/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      const resData = await response.json();
      return {
        status: response.ok,
        message: resData.message || (response.ok ? "Updated successfully" : "Update failed"),
      };
    } catch (err: any) {
      console.warn(`Update delivery address ${id} failed`, err);
      return { status: false, message: err.message || "Update failed" };
    }
  },

  async deleteDeliveryAddress(id: string): Promise<{
    status: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/delivery-address/${id}`, {
        method: "DELETE",
      });
      const resData = await response.json();
      return {
        status: response.ok,
        message: resData.message || (response.ok ? "Address deleted" : "Delete failed"),
      };
    } catch (err: any) {
      console.warn(`Delete delivery address ${id} failed`, err);
      return { status: false, message: err.message || "Delete failed" };
    }
  },

  async toggleDeliveryAddressStatus(
    id: string,
    isDefault: boolean,
  ): Promise<{
    status: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/delivery-address/${id}/${isDefault}`,
        { method: "PATCH" },
      );
      const resData = await response.json();
      return {
        status: response.ok,
        message: resData.message || (response.ok ? "Default address updated" : "Failed to update default address"),
      };
    } catch (err: any) {
      console.warn(`Toggle delivery address status ${id} failed`, err);
      return { status: false, message: err.message || "Failed to update default address" };
    }
  },

  // ===================== CART APIS =====================
  async fetchCart(userId?: string): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/cart`);
      if (userId) url.searchParams.append("userId", userId);
      const headers: Record<string, string> = {};
      try {
        const token = localStorage.getItem("rms_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {}

      const response = await fetch(url.toString(), { headers });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return (
        resData.data?.items ||
        (Array.isArray(resData.data) ? resData.data : []) ||
        []
      );
    } catch (err) {
      console.warn("fetchCart API failed:", err);
      return [];
    }
  },

  async addToCart(
    item: {
      productId: string | number;
      colorId?: string | number;
      quantity?: number;
    },
    userId?: string,
  ): Promise<{ status: boolean; data?: any; message?: string }> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      try {
        const token = localStorage.getItem("rms_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {}

      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          productId: String(item.productId),
          colorId: item.colorId ? String(item.colorId) : undefined,
          quantity: item.quantity || 1,
          userId,
        }),
      });
      const resData = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errorMsg = Array.isArray(resData.message)
          ? resData.message.join(", ")
          : resData.message || resData.error || `Failed to add to cart (HTTP ${response.status})`;
        return {
          status: false,
          message: errorMsg,
        };
      }
      return {
        status: true,
        data: resData.data,
        message: resData.data?.message || resData.message || "Product added to cart",
      };
    } catch (err: any) {
      console.warn("addToCart API failed:", err);
      return { status: false, message: err.message || "Failed to add to cart" };
    }
  },

  async updateCartItemQty(
    itemId: string,
    quantity: number,
    userId?: string,
  ): Promise<{ status: boolean; data?: any; message?: string }> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      try {
        const token = localStorage.getItem("rms_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {}

      const response = await fetch(
        `${API_BASE_URL}/cart/item/${encodeURIComponent(itemId)}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ quantity, userId }),
        },
      );
      const resData = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errorMsg = Array.isArray(resData.message)
          ? resData.message.join(", ")
          : resData.message || resData.error || `Failed to update cart item (HTTP ${response.status})`;
        return {
          status: false,
          message: errorMsg,
        };
      }
      return {
        status: true,
        data: resData.data,
        message: resData.data?.message || resData.message || "Cart updated",
      };
    } catch (err: any) {
      console.warn("updateCartItemQty API failed:", err);
      return { status: false, message: err.message || "Failed to update cart item" };
    }
  },

  async removeCartItem(
    itemId: string,
    userId?: string,
  ): Promise<{ status: boolean; message?: string }> {
    try {
      const url = new URL(
        `${API_BASE_URL}/cart/item/${encodeURIComponent(itemId)}`,
      );
      if (userId) url.searchParams.append("userId", userId);
      const headers: Record<string, string> = {};
      try {
        const token = localStorage.getItem("rms_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {}

      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers,
      });
      const resData = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errorMsg = Array.isArray(resData.message)
          ? resData.message.join(", ")
          : resData.message || resData.error || `Failed to remove item (HTTP ${response.status})`;
        return {
          status: false,
          message: errorMsg,
        };
      }
      return {
        status: true,
        message: resData.data?.message || resData.message || "Item removed from cart",
      };
    } catch (err: any) {
      console.warn("removeCartItem API failed:", err);
      return { status: false, message: err.message || "Failed to remove item" };
    }
  },

  async clearCart(
    userId?: string,
  ): Promise<{ status: boolean; message?: string }> {
    try {
      const url = new URL(`${API_BASE_URL}/cart`);
      if (userId) url.searchParams.append("userId", userId);
      const headers: Record<string, string> = {};
      try {
        const token = localStorage.getItem("rms_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {}

      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers,
      });
      const resData = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errorMsg = Array.isArray(resData.message)
          ? resData.message.join(", ")
          : resData.message || resData.error || `Failed to clear cart (HTTP ${response.status})`;
        return {
          status: false,
          message: errorMsg,
        };
      }
      return {
        status: true,
        message: resData.data?.message || resData.message || "Cart cleared",
      };
    } catch (err: any) {
      console.warn("clearCart API failed:", err);
      return { status: false, message: err.message || "Failed to clear cart" };
    }
  },

  // ===================== WISHLIST APIS =====================
  async fetchWishlist(userId?: string): Promise<{
    productIds: (string | number)[];
    products: any[];
  }> {
    try {
      const url = new URL(`${API_BASE_URL}/wishlist`);
      if (userId) url.searchParams.append("userId", userId);
      const headers: Record<string, string> = {};
      try {
        const token = localStorage.getItem("rms_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {}

      const response = await fetch(url.toString(), { headers });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();

      let productIds: (string | number)[] = [];
      let products: any[] = [];

      if (resData.data) {
        if (Array.isArray(resData.data.productIds)) {
          productIds = resData.data.productIds;
        } else if (Array.isArray(resData.data)) {
          productIds = resData.data.map((w: any) =>
            w.product?.id || w.productId || w.id || w,
          );
        }

        if (Array.isArray(resData.data.products)) {
          products = resData.data.products;
        } else if (Array.isArray(resData.data)) {
          products = resData.data.map((w: any) => w.product || w);
        }
      }

      return { productIds, products };
    } catch (err) {
      console.warn("fetchWishlist API failed:", err);
      return { productIds: [], products: [] };
    }
  },

  async toggleWishlist(
    productId: string | number,
    userId?: string,
  ): Promise<{ status: boolean; inWishlist?: boolean; message?: string }> {
    try {
      const url = new URL(
        `${API_BASE_URL}/wishlist/${encodeURIComponent(productId)}`,
      );
      if (userId) url.searchParams.append("userId", userId);
      const headers: Record<string, string> = {};
      try {
        const token = localStorage.getItem("rms_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {}

      const response = await fetch(url.toString(), {
        method: "POST",
        headers,
      });
      const resData = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errorMsg = Array.isArray(resData.message)
          ? resData.message.join(", ")
          : resData.message || resData.error || `Failed to update wishlist (HTTP ${response.status})`;
        return {
          status: false,
          message: errorMsg,
        };
      }
      return {
        status: true,
        inWishlist: resData.data?.inWishlist ?? true,
        message: resData.data?.message || resData.message || "Wishlist updated",
      };
    } catch (err: any) {
      console.warn("toggleWishlist API failed:", err);
      return { status: false, message: err.message || "Failed to update wishlist" };
    }
  },

  async removeFromWishlist(
    productId: string | number,
    userId?: string,
  ): Promise<{ status: boolean; message?: string }> {
    try {
      const url = new URL(
        `${API_BASE_URL}/wishlist/${encodeURIComponent(productId)}`,
      );
      if (userId) url.searchParams.append("userId", userId);
      const headers: Record<string, string> = {};
      try {
        const token = localStorage.getItem("rms_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {}

      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers,
      });
      const resData = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errorMsg = Array.isArray(resData.message)
          ? resData.message.join(", ")
          : resData.message || resData.error || `Failed to remove from wishlist (HTTP ${response.status})`;
        return {
          status: false,
          message: errorMsg,
        };
      }
      return {
        status: true,
        message: resData.data?.message || resData.message || "Removed from wishlist",
      };
    } catch (err: any) {
      console.warn("removeFromWishlist API failed:", err);
      return {
        status: false,
        message: err.message || "Failed to remove from wishlist",
      };
    }
  },

  // ===================== ORDER / CHECKOUT APIS =====================
  async createOrder(orderData: {
    buyerId?: string;
    items: {
      productId: string | number;
      colorId?: string | number;
      quantity: number;
      price?: number;
      discount?: number;
    }[];
    lender?: string;
    tenureMonths?: number;
    monthlyInstallment?: number;
    landmark?: string;
    deliveryOtp?: string;
    payMethod?: string;
  }): Promise<{ status: boolean; data?: any; message?: string }> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      try {
        const token = localStorage.getItem("rms_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {}

      const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: "POST",
        headers,
        body: JSON.stringify(orderData),
      });
      const resData = await response.json();
      return {
        status: response.ok,
        data: resData.data,
        message: resData.message,
      };
    } catch (err: any) {
      console.warn("createOrder API failed:", err);
      return { status: false, message: err.message || "Failed to place order" };
    }
  },

  async fetchUserOrders(userId?: string): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/orders`);
      if (userId) url.searchParams.append("userId", userId);
      const headers: Record<string, string> = {};
      try {
        const token = localStorage.getItem("rms_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {}

      const response = await fetch(url.toString(), { headers });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return (
        resData.data?.orders ||
        (Array.isArray(resData.data) ? resData.data : []) ||
        []
      );
    } catch (err) {
      console.warn("fetchUserOrders API failed:", err);
      return [];
    }
  },

  async fetchOrderById(orderId: string): Promise<any | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`,
      );
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const resData = await response.json();
      return resData.data || null;
    } catch (err) {
      console.warn(`fetchOrderById ${orderId} failed:`, err);
      return null;
    }
  },
};


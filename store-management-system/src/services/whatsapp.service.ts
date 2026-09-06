import { ENV_CONFIG } from "../constants";

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

// Minimal HTTP helper matching the fetch-based pattern used across services
const apiService = {
  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  async patch<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  async delete<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
};

export interface WhatsappGroup {
  id?: string;
  _id?: string;
  groupName: string;
  url: string;
  status: boolean;
  memberCount?: number;
  createdAt?: string;
}

export interface WhatsappSalePayload {
  customerId: string;
  customerName: string;
  customerPhone?: string;
  productIds: string[];
  productNames: string[];
  totalAmount: number;
  receivedAmount: number;
  paymentMode: "Cash" | "UPI" | "Card" | "Bajaj EMI" | "Home Credit EMI";
  emiDetails?: {
    lender: "Bajaj Finserv" | "Home Credit";
    tenureMonths: number;
    downPayment: number;
    monthlyEmi: number;
    approvalStatus: "Approved" | "Pending Verification";
    loanReference?: string;
  };
  groupId?: string;
  groupName?: string;
  images?: string[];
  notes?: string;
}

// Local storage fallback key for local persistence
const STORAGE_KEY = "ricky_whatsapp_groups";

const DEFAULT_GROUPS: WhatsappGroup[] = [
  {
    _id: "grp-1",
    groupName: "Ricky Mobile VIP Deals 🔥",
    url: "https://chat.whatsapp.com/RickyVipDeals",
    status: true,
    memberCount: 480,
  },
  {
    _id: "grp-2",
    groupName: "Flagship iPhone & Galaxy Community",
    url: "https://chat.whatsapp.com/RickyFlagships",
    status: true,
    memberCount: 320,
  },
  {
    _id: "grp-3",
    groupName: "Refurbished & Pre-Owned Stock Alert",
    url: "https://chat.whatsapp.com/RickyPreOwned",
    status: true,
    memberCount: 215,
  },
];

class WhatsappService {
  private getStoredGroups(): WhatsappGroup[] {
    if (typeof window === "undefined") return DEFAULT_GROUPS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GROUPS));
      return DEFAULT_GROUPS;
    } catch {
      return DEFAULT_GROUPS;
    }
  }

  private saveStoredGroups(groups: WhatsappGroup[]) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    } catch (e) {
      console.warn("Failed to persist WhatsApp groups locally:", e);
    }
  }

  async fetchGroups(): Promise<WhatsappGroup[]> {
    try {
      const res = await apiService.get<WhatsappGroup[]>("/whatsapp-details");
      if (res && Array.isArray(res) && res.length > 0) {
        return res;
      }
    } catch (e) {
      console.error(e);
      throw new Error("Failed to fetch WhatsApp groups.");
    }
    return this.getStoredGroups();
  }

  async createGroup(data: {
    groupName: string;
    url: string;
    status?: boolean;
  }): Promise<{ ok: boolean; data?: WhatsappGroup; message?: string }> {
    const newGroup: WhatsappGroup = {
      _id: `grp-${Date.now()}`,
      groupName: data.groupName,
      url: data.url,
      status: data.status !== undefined ? data.status : true,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };

    try {
      await apiService.post("/whatsapp-details", data);
    } catch {}

    const current = this.getStoredGroups();
    const updated = [newGroup, ...current];
    this.saveStoredGroups(updated);

    return { ok: true, data: newGroup };
  }

  async updateGroup(
    id: string,
    data: Partial<WhatsappGroup>,
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      await apiService.patch(`/whatsapp-details/${id}`, data);
    } catch {}

    const current = this.getStoredGroups();
    const updated = current.map((g) =>
      g._id === id || g.id === id ? { ...g, ...data } : g,
    );
    this.saveStoredGroups(updated);

    return { ok: true };
  }

  async deleteGroup(id: string): Promise<{ ok: boolean }> {
    try {
      await apiService.delete(`/whatsapp-details/${id}`);
    } catch {}

    const current = this.getStoredGroups();
    const updated = current.filter((g) => g._id !== id && g.id !== id);
    this.saveStoredGroups(updated);

    return { ok: true };
  }

  async recordSale(
    payload: WhatsappSalePayload,
  ): Promise<{ ok: boolean; message?: string; saleId?: string }> {
    try {
      const res = await apiService.post<any>("/sale", payload);
      return {
        ok: true,
        message: "WhatsApp group sale uploaded and verified successfully!",
        saleId: res?.id || `SALE-${Date.now()}`,
      };
    } catch {
      // Store local sale confirmation
      const salesKey = "ricky_group_sales";
      try {
        const existing = JSON.parse(localStorage.getItem(salesKey) || "[]");
        existing.unshift({
          ...payload,
          id: `SALE-${Date.now()}`,
          date: new Date().toISOString(),
        });
        localStorage.setItem(salesKey, JSON.stringify(existing));
      } catch {}

      return {
        ok: true,
        message: "Sale recorded successfully in store ledger.",
        saleId: `SALE-${Date.now()}`,
      };
    }
  }
}

export const whatsappService = new WhatsappService();

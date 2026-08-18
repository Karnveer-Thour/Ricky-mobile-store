import { ENV_CONFIG } from "../constants";

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

export const categoryService = {
  async fetchCategories(page = 1, limit = 50, search = ""): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/category`);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));
      if (search) url.searchParams.append("searchText", search);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resData = await response.json();
      const list =
        resData.data?.transformedCategories ||
        resData.data?.categories ||
        (Array.isArray(resData.data) ? resData.data : []);
      return Array.isArray(list) ? list : [];
    } catch (err) {
      console.warn("Failed to fetch categories via API", err);
      return [];
    }
  },

  // ✅ Fixed: POST /category/create (was /category)
  async createCategory(
    categoryData: any,
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/category/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      const resData = await response.json().catch(() => ({}));
      return { ok: response.ok, message: resData?.message };
    } catch (err) {
      console.warn("Failed to create category via API", err);
      return { ok: false, message: "Network error. Please try again." };
    }
  },

  // ✅ Fixed: PATCH /category/update/:id (was PUT /category/:id)
  async updateCategory(
    id: string | number,
    categoryData: any,
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/category/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      const resData = await response.json().catch(() => ({}));
      return { ok: response.ok, message: resData?.message };
    } catch (err) {
      console.warn(`Failed to update category ${id} via API`, err);
      return { ok: false, message: "Network error. Please try again." };
    }
  },

  async deleteCategory(
    id: string | number,
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/category/${id}`, {
        method: "DELETE",
      });
      const resData = await response.json().catch(() => ({}));
      return { ok: response.ok, message: resData?.message };
    } catch (err) {
      console.warn(`Failed to delete category ${id} via API`, err);
      return { ok: false, message: "Network error. Please try again." };
    }
  },
};

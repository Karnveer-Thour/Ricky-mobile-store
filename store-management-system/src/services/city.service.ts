import { ENV_CONFIG } from "../constants";

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

export const cityService = {
  async fetchCities(page = 1, limit = 50, search = ""): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/accepted-cities`);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));
      if (search) url.searchParams.append("searchText", search);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resData = await response.json();
      const rawList =
        resData.data?.transformedCities ||
        resData.data?.cities ||
        (Array.isArray(resData.data) ? resData.data : []);

      const list = Array.isArray(rawList) ? rawList : [];
      return list.map((c: any) => ({
        ...c,
        id: c._id || c.id,
        name: c.name || c.cityName,
        pincode: c.pincode || c.cityPincode,
      }));
    } catch (err) {
      console.warn("Failed to fetch accepted cities via API", err);
      return [];
    }
  },

  async createCity(cityData: any): Promise<{ ok: boolean; message?: string }> {
    try {
      const payload = {
        cityName: cityData.cityName || cityData.name,
        cityPincode: Number(cityData.cityPincode || cityData.pincode) || 0,
        district: cityData.district,
        state: cityData.state,
        isAccepting: cityData.isAccepting ?? true,
      };

      const response = await fetch(`${API_BASE_URL}/accepted-cities/create`, {
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
      console.warn("Failed to create city via API", err);
      return { ok: false, message: "Network error. Please try again." };
    }
  },

  async updateCity(
    id: string | number,
    cityData: any,
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      const payload: Record<string, any> = {};
      if (cityData.cityName || cityData.name) {
        payload.cityName = cityData.cityName || cityData.name;
      }
      if (cityData.cityPincode || cityData.pincode) {
        payload.cityPincode = Number(cityData.cityPincode || cityData.pincode);
      }
      if (cityData.district) payload.district = cityData.district;
      if (cityData.state) payload.state = cityData.state;
      if (cityData.isAccepting !== undefined)
        payload.isAccepting = cityData.isAccepting;

      const response = await fetch(
        `${API_BASE_URL}/accepted-cities/update/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const resData = await response.json().catch(() => ({}));
      const errorMessage = Array.isArray(resData?.message)
        ? resData.message.join(", ")
        : resData?.message;

      return { ok: response.ok, message: errorMessage };
    } catch (err) {
      console.warn(`Failed to update city ${id} via API`, err);
      return { ok: false, message: "Network error. Please try again." };
    }
  },

  async toggleCityStatus(
    id: string | number,
    isAccepting: boolean,
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/accepted-cities/toggle/status/${id}/${isAccepting}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );
      const resData = await response.json().catch(() => ({}));
      const errorMessage = Array.isArray(resData?.message)
        ? resData.message.join(", ")
        : resData?.message;

      return { ok: response.ok, message: errorMessage };
    } catch (err) {
      console.warn(`Failed to toggle city status ${id} via API`, err);
      return { ok: false, message: "Network error. Please try again." };
    }
  },

  async deleteCity(
    id: string | number,
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/accepted-cities/${id}`, {
        method: "DELETE",
      });
      const resData = await response.json().catch(() => ({}));
      const errorMessage = Array.isArray(resData?.message)
        ? resData.message.join(", ")
        : resData?.message;

      return { ok: response.ok, message: errorMessage };
    } catch (err) {
      console.warn(`Failed to delete city ${id} via API`, err);
      return { ok: false, message: "Network error. Please try again." };
    }
  },
};

import { ENV_CONFIG } from '../constants';

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

export const searchService = {
  async globalSearch(query: string): Promise<any> {
    try {
      const url = new URL(`${API_BASE_URL}/global/search`);
      url.searchParams.append('query', query);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resData = await response.json();
      return resData.data || resData;
    } catch (err) {
      console.warn('Global search API failed', err);
      return null;
    }
  },
};

import { ENV_CONFIG } from '../constants';

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

export const uploadService = {
  async uploadImage(file: File, folder = 'products'): Promise<{ status: boolean; url?: string; message?: string }> {
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
};

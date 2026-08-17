import { Provider } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ENV_CONFIG } from 'Common/constants';

export const CLOUDINARY = 'Cloudinary';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return cloudinary.config({
      cloud_name: ENV_CONFIG.CLOUDINARY.CLOUD_NAME,
      api_key: ENV_CONFIG.CLOUDINARY.API_KEY,
      api_secret: ENV_CONFIG.CLOUDINARY.API_SECRET,
    });
  },
};

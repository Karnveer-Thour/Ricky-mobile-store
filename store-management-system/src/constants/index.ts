import { ENV_CONFIG } from '../config/env.config';

export * from '../config/env.config';

export const API_URL = ENV_CONFIG.API_BASE_URL;
export const APP_TITLE = ENV_CONFIG.APP_TITLE;
export const UPI_SPLIT_PAY_URL = ENV_CONFIG.UPI_SPLIT_PAY_URL;
export const CHECKOUT_RETRY_URL = ENV_CONFIG.CHECKOUT_RETRY_URL;

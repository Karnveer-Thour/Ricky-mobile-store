import { ENV_CONFIG } from './config/env.config';

export * from './config/env.config';

export const API_URL = ENV_CONFIG.API_BASE_URL;
export const APP_TITLE = ENV_CONFIG.APP_TITLE;
export const DEFAULT_SUPPORT_REPLY = ENV_CONFIG.DEFAULT_SUPPORT_REPLY;

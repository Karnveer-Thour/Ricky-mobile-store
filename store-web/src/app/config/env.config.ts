export const ENV_KEYS = {
  VITE_API_URL: 'VITE_API_URL',
  VITE_APP_TITLE: 'VITE_APP_TITLE',
  VITE_CHAT_SUPPORT_REPLY: 'VITE_CHAT_SUPPORT_REPLY',
} as const;

export const ENV_CONFIG = {
  get API_BASE_URL() {
    return import.meta.env.VITE_API_URL || 'http://localhost:8001';
  },

  get APP_TITLE() {
    return import.meta.env.VITE_APP_TITLE || 'Ricky Mobile Store';
  },

  get DEFAULT_SUPPORT_REPLY() {
    return (
      import.meta.env.VITE_CHAT_SUPPORT_REPLY ||
      'Thanks for your message! Our team will get back to you shortly. Typical response time is under 5 minutes.'
    );
  },
};

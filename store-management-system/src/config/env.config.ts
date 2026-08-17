export const ENV_KEYS = {
  NEXT_PUBLIC_API_URL: 'NEXT_PUBLIC_API_URL',
  NEXT_PUBLIC_APP_TITLE: 'NEXT_PUBLIC_APP_TITLE',
  NEXT_PUBLIC_UPI_SPLIT_PAY_URL: 'NEXT_PUBLIC_UPI_SPLIT_PAY_URL',
  NEXT_PUBLIC_CHECKOUT_RETRY_URL: 'NEXT_PUBLIC_CHECKOUT_RETRY_URL',
} as const;

export const ENV_CONFIG = {
  get API_BASE_URL() {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
  },

  get APP_TITLE() {
    return process.env.NEXT_PUBLIC_APP_TITLE || 'Ricky Mobile Store Admin';
  },

  get UPI_SPLIT_PAY_URL() {
    return (
      process.env.NEXT_PUBLIC_UPI_SPLIT_PAY_URL ||
      'https://upi.rickystore.in/pay/rms-split-pay'
    );
  },

  get CHECKOUT_RETRY_URL() {
    return (
      process.env.NEXT_PUBLIC_CHECKOUT_RETRY_URL ||
      'https://rickymobilestore.in/checkout?retry=true'
    );
  },
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE || 'Ricky Mobile Store Admin';

// Canned reply URLs for the support chat workspace
export const UPI_SPLIT_PAY_URL = 
  process.env.NEXT_PUBLIC_UPI_SPLIT_PAY_URL || 
  'https://upi.rickystore.in/pay/rms-split-pay';

export const CHECKOUT_RETRY_URL = 
  process.env.NEXT_PUBLIC_CHECKOUT_RETRY_URL || 
  'https://rickymobilestore.in/checkout?retry=true';

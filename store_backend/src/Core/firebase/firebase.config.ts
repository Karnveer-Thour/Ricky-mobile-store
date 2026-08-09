import * as dotenv from 'dotenv';
import { FIREBASE_DEFAULTS } from 'Common/constants';
dotenv.config();

export const firebaseConfig = {
  type: process.env.TYPE || FIREBASE_DEFAULTS.TYPE,
  project_id: process.env.PROJECT_ID || FIREBASE_DEFAULTS.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID || FIREBASE_DEFAULTS.PRIVATE_KEY_ID,
  private_key: (process.env.PRIVATE_KEY || FIREBASE_DEFAULTS.PRIVATE_KEY).replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL || FIREBASE_DEFAULTS.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID || FIREBASE_DEFAULTS.CLIENT_ID,
  auth_uri: process.env.AUTH_URI || FIREBASE_DEFAULTS.AUTH_URI,
  token_uri: process.env.TOKEN_URI || FIREBASE_DEFAULTS.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL || FIREBASE_DEFAULTS.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL || FIREBASE_DEFAULTS.CLIENT_X509_CERT_URL,
};

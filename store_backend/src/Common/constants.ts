export const DEFAULT_PORT = 3000;
export const DEFAULT_DB_PORT = 5432;
export const DEFAULT_DB_HOST = 'localhost';

export const JWT_DEFAULT_EXPIRY = '1d';

export const FIREBASE_DEFAULTS = {
  TYPE: 'service_account',
  PROJECT_ID: 'mock-project-id',
  PRIVATE_KEY_ID: 'mock-private-key-id',
  PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\nMOCK_PRIVATE_KEY_CREDENTIAL_DATA\n-----END PRIVATE KEY-----\n',
  CLIENT_EMAIL: 'mock@project.iam.gserviceaccount.com',
  CLIENT_ID: '123456789',
  AUTH_URI: 'https://accounts.google.com/o/oauth2/auth',
  TOKEN_URI: 'https://oauth2.googleapis.com/token',
  AUTH_PROVIDER_X509_CERT_URL: 'https://www.googleapis.com/oauth2/v1/certs',
  CLIENT_X509_CERT_URL: 'https://www.googleapis.com/renderer/certs',
};

export * from './config/env.config';

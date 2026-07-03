import * as dotenv from 'dotenv';
dotenv.config();

export const firebaseConfig = {
  type: process.env.TYPE || 'service_account',
  project_id: process.env.PROJECT_ID || 'mock-project-id',
  private_key_id: process.env.PRIVATE_KEY_ID || 'mock-private-key-id',
  private_key: (process.env.PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nMOCK_PRIVATE_KEY_CREDENTIAL_DATA\n-----END PRIVATE KEY-----\n').replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL || 'mock@project.iam.gserviceaccount.com',
  client_id: process.env.CLIENT_ID || '123456789',
  auth_uri: process.env.AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
  token_uri: process.env.TOKEN_URI || 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL || 'https://www.googleapis.com/renderer/certs',
};

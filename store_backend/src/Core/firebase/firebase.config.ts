import * as dotenv from 'dotenv';
import { ENV_CONFIG } from 'Common/constants';
dotenv.config();

const fb = ENV_CONFIG.FIREBASE;

export const firebaseConfig = {
  type: fb.TYPE,
  project_id: fb.PROJECT_ID,
  private_key_id: fb.PRIVATE_KEY_ID,
  private_key: fb.PRIVATE_KEY,
  client_email: fb.CLIENT_EMAIL,
  client_id: fb.CLIENT_ID,
  auth_uri: fb.AUTH_URI,
  token_uri: fb.TOKEN_URI,
  auth_provider_x509_cert_url: fb.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: fb.CLIENT_X509_CERT_URL,
};

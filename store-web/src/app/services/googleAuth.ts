/**
 * googleAuth.ts
 *
 * Google Sign-In integration for store-web — powered by @react-oauth/google.
 *
 * This module no longer uses the Firebase Web SDK. Instead it relies on
 * Google Identity Services (GIS) via the @react-oauth/google library.
 *
 * Flow:
 *   1. <GoogleOAuthProvider clientId={...}> wraps the app in main.tsx
 *   2. useGoogleLogin() / GoogleLogin component triggers the Google popup
 *   3. On success, Google returns a { credential } JWT (ID token)
 *   4. That credential is posted to POST /user/login/social/:token
 *   5. Backend verifies via google-auth-library (no Firebase needed on frontend)
 *
 * Required env var (store-web/.env):
 *   VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
 *
 * Get the Client ID from:
 *   https://console.cloud.google.com/apis/credentials
 *   → Create OAuth 2.0 Client ID (Web application)
 *   → Add Authorized JS Origin: http://localhost:5173
 */

let dynamicGoogleClientId = '';

export function setDynamicGoogleClientId(id: string) {
  dynamicGoogleClientId = id;
}

/** Returns true when the Google Client ID is configured (either in .env or via backend API). */
export function isGoogleConfigured(): boolean {
  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const clientId = dynamicGoogleClientId || envId;
  return !!(clientId && clientId.trim() && !clientId.includes('your-google'));
}

/** The Google OAuth Client ID (from backend API or Vite env vars). */
export function getGoogleClientId(): string {
  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  return dynamicGoogleClientId || envId || '';
}

export const GOOGLE_CLIENT_ID: string =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? '';

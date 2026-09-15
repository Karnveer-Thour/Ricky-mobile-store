/**
 * googleAuth.ts
 * Firebase Google Sign-In integration for store-web.
 *
 * This module initialises the Firebase client SDK (once) and exposes a
 * single helper – signInWithGoogle() – that opens the Google OAuth popup
 * and resolves with the Firebase ID token that the backend expects.
 *
 * To enable this in production:
 *   1. Go to Firebase Console → Project settings → Your apps → Web app
 *   2. Copy the firebaseConfig object values
 *   3. Paste them into store-web/.env as VITE_FIREBASE_* variables
 *   4. Restart the dev server
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  type Auth,
} from "firebase/auth";

// ---------------------------------------------------------------------------
// Firebase web app config – reads from Vite env vars at build time
// ---------------------------------------------------------------------------
const firebaseWebConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

/** Returns true only when all required Firebase web config keys are present. */
export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseWebConfig.apiKey &&
    firebaseWebConfig.authDomain &&
    firebaseWebConfig.projectId &&
    firebaseWebConfig.appId
  );
}

// ---------------------------------------------------------------------------
// Lazy singleton initialisation (safe to call multiple times)
// ---------------------------------------------------------------------------
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;

function getFirebaseAuth(): Auth | null {
  if (!isFirebaseConfigured()) return null;

  if (!_app) {
    // Re-use an already-initialised app (hot-reload safe)
    _app = getApps().length ? getApps()[0] : initializeApp(firebaseWebConfig);
  }
  if (!_auth) {
    _auth = getAuth(_app);
  }
  return _auth;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface GoogleSignInResult {
  /** Firebase ID token to pass to the backend */
  idToken: string;
  /** Display name from Google account */
  displayName: string | null;
  /** Email from Google account */
  email: string | null;
  /** Profile photo URL */
  photoURL: string | null;
}

/**
 * Opens the Google OAuth popup and returns the Firebase ID token.
 * Throws a descriptive Error when:
 *   - Firebase is not configured (env vars missing)
 *   - The user cancels the popup
 *   - Any network / OAuth error occurs
 */
export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error(
      "Google Sign-In is not configured yet. " +
        "Please add the VITE_FIREBASE_* environment variables to store-web/.env and restart the dev server. " +
        "See store-web/.env.example for the required variable names."
    );
  }

  const provider = new GoogleAuthProvider();
  // Request the user's email and profile so the backend can create an account
  provider.addScope("email");
  provider.addScope("profile");

  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();

  return {
    idToken,
    displayName: result.user.displayName,
    email: result.user.email,
    photoURL: result.user.photoURL,
  };
}

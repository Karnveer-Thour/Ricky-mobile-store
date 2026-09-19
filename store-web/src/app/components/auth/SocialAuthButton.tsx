import React, { useState, useEffect } from "react";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  type CredentialResponse,
} from "@react-oauth/google";
import { isGoogleConfigured } from "../../services/googleAuth";
import { apiService } from "../../services/apiService";

interface SocialAuthButtonProps {
  onGoogleCredential: (credential: string) => void;
  isLoading: boolean;
}

/**
 * SocialAuthButton
 *
 * Renders Google's official sign-in button using @react-oauth/google.
 * Automatically fetches the Google Client ID from the backend API
 * (/user/auth/config) if not explicitly set in store-web/.env.
 */
export default function SocialAuthButton({
  onGoogleCredential,
  isLoading,
}: SocialAuthButtonProps) {
  const [clientId, setClientId] = useState<string>(() => {
    const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
    return envId && !envId.includes("your-google") ? envId : "";
  });

  useEffect(() => {
    if (!clientId) {
      apiService.fetchAuthConfig().then((cfg) => {
        if (cfg.isGoogleConfigured && cfg.googleClientId) {
          setClientId(cfg.googleClientId);
        }
      });
    }
  }, [clientId]);

  const configured = !!(
    clientId &&
    clientId.trim() &&
    !clientId.includes("your-google")
  );

  const handleSuccess = (response: CredentialResponse) => {
    if (response.credential) {
      onGoogleCredential(response.credential);
    }
  };

  const handleError = () => {
    console.warn("Google Sign-In popup closed or failed.");
  };

  if (!configured) {
    return (
      <>
        <div
          title="VITE_GOOGLE_CLIENT_ID is not set in store-web/.env"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-gray-500 mb-4 cursor-not-allowed opacity-50 select-none"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google (not configured)</span>
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
            OR WITH EMAIL
          </span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={`w-full flex justify-center mb-4 transition-opacity ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          theme="filled_black"
          shape="rectangular"
          size="large"
          width="400"
          text="continue_with"
          logo_alignment="left"
          useOneTap={false}
        />
      </div>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-[1px] bg-white/10" />
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
          OR WITH EMAIL
        </span>
        <div className="flex-1 h-[1px] bg-white/10" />
      </div>
    </>
  );
}

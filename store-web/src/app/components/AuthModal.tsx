import { useState, useEffect } from "react";
import { useToast } from "../hooks/useToast";
import { useApp } from "../AppContext";
import AuthModalHeader from "./auth/AuthModalHeader";
import SocialAuthButton from "./auth/SocialAuthButton";
import SignInForm from "./auth/SignInForm";
import CreateAccountForm from "./auth/CreateAccountForm";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    register,
    loginWithGoogle,
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAuthModal();
    }
    if (isAuthModalOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleModeSwitch = (mode: "login" | "register") => {
    openAuthModal(mode);
  };

  // ── Sign In ─────────────────────────────────────────────────────────────
  const handleLoginSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    const id = toast.loading("Signing you in…");
    const result = await login(email, password);
    setIsLoading(false);

    toast.resolve(
      id,
      result.success,
      "Welcome back! 👋",
      result.message || "Invalid email or password.",
      "Check your credentials and try again.",
    );
    if (result.success) setTimeout(() => closeAuthModal(), 600);
  };

  // ── Register ────────────────────────────────────────────────────────────
  const handleRegisterSubmit = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    password: string;
  }) => {
    setIsLoading(true);
    const id = toast.loading("Creating your account…");
    const result = await register(userData);
    setIsLoading(false);

    toast.resolve(
      id,
      result.success,
      `Account created 🎉 Welcome, ${userData.firstName}!`,
      result.message || "Account creation failed.",
      "This email may already be registered.",
    );
    if (result.success) setTimeout(() => closeAuthModal(), 700);
  };

  // ── Google Sign-In ──────────────────────────────────────────────────────
  const handleGoogleCredential = async (credential: string) => {
    setIsLoading(true);
    const id = toast.loading("Verifying Google account…");
    const result = await loginWithGoogle(credential);
    setIsLoading(false);

    toast.resolve(
      id,
      result.success,
      "Signed in with Google 🚀",
      result.message || "Google sign-in failed.",
      "Ensure VITE_GOOGLE_CLIENT_ID is configured.",
    );
    if (result.success) setTimeout(() => closeAuthModal(), 600);
  };

  return (
    <div
      onClick={closeAuthModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity cursor-pointer"
    >
      <div
        className="relative w-full max-w-md bg-[#0e0e1c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#00cfff]/10 overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00cfff]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#0077ff]/15 rounded-full blur-3xl pointer-events-none" />

        <AuthModalHeader
          mode={authModalMode}
          onClose={closeAuthModal}
          onModeSwitch={handleModeSwitch}
        />

        <SocialAuthButton
          onGoogleCredential={handleGoogleCredential}
          isLoading={isLoading}
        />

        {authModalMode === "login" ? (
          <SignInForm isLoading={isLoading} onSubmit={handleLoginSubmit} />
        ) : (
          <CreateAccountForm isLoading={isLoading} onSubmit={handleRegisterSubmit} />
        )}

        <div className="mt-5 text-center text-xs text-gray-400">
          {authModalMode === "login" ? (
            <span>
              Don't have an account yet?{" "}
              <button
                type="button"
                onClick={() => handleModeSwitch("register")}
                className="text-[#00cfff] font-bold hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => handleModeSwitch("login")}
                className="text-[#00cfff] font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

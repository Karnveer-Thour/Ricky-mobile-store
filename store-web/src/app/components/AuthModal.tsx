import React, { useState, useEffect } from "react";
import { useApp } from "../AppContext";
import { CheckCircle2, AlertCircle } from "lucide-react";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAuthModal();
    }
    if (isAuthModalOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setMobileNumber("");
    setConfirmPassword("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleModeSwitch = (mode: "login" | "register") => {
    resetForm();
    openAuthModal(mode);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      setSuccessMsg("Signed in successfully! Welcome back.");
      setTimeout(() => {
        closeAuthModal();
        resetForm();
      }, 800);
    } else {
      setErrorMsg(
        result.message || "Failed to sign in. Please verify your credentials.",
      );
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (
      !firstName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !mobileNumber.trim()
    ) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const result = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      mobileNumber: mobileNumber.trim(),
      password,
    });
    setIsLoading(false);

    if (result.success) {
      setSuccessMsg(
        "Account created successfully! Welcome to Ricky Mobile Store.",
      );
      setTimeout(() => {
        closeAuthModal();
        resetForm();
      }, 800);
    } else {
      setErrorMsg(
        result.message || "Account creation failed. Please try again.",
      );
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg("");
    const result = await loginWithGoogle();
    setIsLoading(false);

    if (result.success) {
      setSuccessMsg("Signed in with Google successfully!");
      setTimeout(() => {
        closeAuthModal();
        resetForm();
      }, 800);
    } else {
      setErrorMsg(result.message || "Google sign-in could not be completed.");
    }
  };

  return (
    <div
      onClick={() => {
        closeAuthModal();
        resetForm();
      }}
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
          onClose={() => {
            closeAuthModal();
            resetForm();
          }}
          onModeSwitch={handleModeSwitch}
        />

        <SocialAuthButton
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isLoading}
        />

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs mb-4">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs mb-4">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {authModalMode === "login" ? (
          <SignInForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLoading={isLoading}
            onSubmit={handleLoginSubmit}
          />
        ) : (
          <CreateAccountForm
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isLoading={isLoading}
            onSubmit={handleRegisterSubmit}
          />
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

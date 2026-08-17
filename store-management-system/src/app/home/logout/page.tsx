"use client";
import React from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";

const LogoutPage = () => {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode?.isDarkMode);

  const handleLogout = () => {
    router.push("/auth/login");
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-lg text-center ${
          isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h1 className="text-2xl font-bold mb-4">Are you sure you want to log out?</h1>
        <p className="mb-6">You can always log back in anytime.</p>
        <Button name="Logout" handler={handleLogout} />
      </div>
    </div>
  );
};

export default LogoutPage;
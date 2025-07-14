import React from "react";
import Button from "@/components/Button"; // adjust path if needed

const LogoutPage = ({ isDark = false, handleLogout }: { isDark?: boolean; handleLogout: () => void }) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-lg text-center ${
          isDark ? "bg-gray-700 text-white" : "bg-white"
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
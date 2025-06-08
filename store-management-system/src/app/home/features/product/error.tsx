"use client";

import { AlertTriangle } from "lucide-react";

function Error() {
  return (
    <div className="flex items-center justify-center h-[90vh] px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-red-500" size={48} />
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We couldn’t load the product data right now. Please try again or check your internet connection.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default Error;
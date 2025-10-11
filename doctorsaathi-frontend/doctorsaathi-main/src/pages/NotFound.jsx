import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 text-gray-800 text-center px-6">
      <div className="animate-bounce mb-6">
        <AlertTriangle className="w-20 h-20 text-red-500" />
      </div>

      <h1 className="text-9xl font-extrabold text-gray-400 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for doesn’t exist or has been moved. Let’s get
        you back on track!
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;

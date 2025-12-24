import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Authcontext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        🤖 AI Content Assistant
      </h1>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            
            <button
              onClick={logout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-600 hover:underline"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

"use client";

import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="p-4 bg-gray-100 flex justify-between items-center shadow-sm">
      <div className="text-xl font-bold text-blue-800">
        <Link href="/">PersonaScape</Link>
      </div>
      
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href={`/p/${user.username}`}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              My Profile
            </Link>
            <button
              onClick={logout}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

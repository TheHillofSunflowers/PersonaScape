"use client";

import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="p-4 bg-gray-100 flex justify-between items-center">
      <div className="text-lg font-semibold">
        <Link href="/">Your App</Link>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <button
            onClick={logout}
            className="text-red-500 hover:underline"
          >
            Log out
          </button>
        ) : (
          <>
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

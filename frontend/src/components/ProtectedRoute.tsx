"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 w-64 bg-gray-200 rounded mb-6 mx-auto"></div>
            <div className="h-32 w-full max-w-md bg-gray-200 rounded mb-6"></div>
          </div>
          <p className="text-gray-500 mt-4">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user, we'll redirect in the useEffect
  if (!user) {
    return <p className="text-center mt-10">Redirecting to login...</p>;
  }

  // User is authenticated, render children
  return <>{children}</>;
}

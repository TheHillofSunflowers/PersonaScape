"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { encodeUsername } from "@/lib/imageUtils";

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user?.username) {
        // Redirect to the user's profile with proper URL encoding
        const encodedUsername = encodeUsername(user.username);
        router.push(`/p/${encodedUsername}`);
      } else {
        // Redirect to login if not authenticated
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router, user]);

  return (
    <div className="min-h-screen bg-[#16171d] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
    </div>
  );
} 
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LikedProfiles from '@/components/LikedProfiles';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#16171d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirection will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#16171d] text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="flex justify-between items-center mb-10">
          <Link 
            href="/"
            className="text-2xl font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            PersonaScape
          </Link>
          <nav className="flex space-x-6 text-sm">
            <Link 
              href="/leaderboard"
              className="text-gray-400 hover:text-white transition"
            >
              Leaderboard
            </Link>
            <Link 
              href="/dashboard"
              className="text-blue-400 font-medium border-b-2 border-blue-400 pb-1"
            >
              Dashboard
            </Link>
            <Link 
              href="/profile"
              className="text-gray-400 hover:text-white transition"
            >
              My Profile
            </Link>
            <Link 
              href="/logout"
              className="text-gray-400 hover:text-white transition"
            >
              Log Out
            </Link>
          </nav>
        </header>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Manage your profile and see your interactions.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* User info and actions */}
          <div className="bg-[#23242b] rounded-xl p-6 border border-[#32333c] shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Welcome, {user?.username}!</h2>
            <p className="text-gray-300 mb-6">Email: {user?.email}</p>
            <div className="space-y-3">
              <Link 
                href={`/p/${user?.username}`}
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-center transition-colors"
              >
                View My Profile
              </Link>
              <Link 
                href="/profile/edit"
                className="block w-full bg-[#2a2b33] hover:bg-[#32333c] text-white py-2 px-4 rounded-md text-center transition-colors"
              >
                Edit My Profile
              </Link>
            </div>
          </div>
          
          {/* Profiles user has liked */}
          <LikedProfiles title="Profiles You've Liked" />
        </div>
      </div>
    </div>
  );
}

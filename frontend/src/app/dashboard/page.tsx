'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LikedProfiles from '@/components/LikedProfiles';
import Link from 'next/link';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirection will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="space-y-6">
          {/* User info and actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Welcome, {user?.username}!</h2>
            <p className="text-gray-600 mb-4">Email: {user?.email}</p>
            <div className="space-y-3">
              <Link 
                href={`/p/${user?.username}`}
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center"
              >
                View My Profile
              </Link>
              <Link 
                href="/profile/edit"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded text-center"
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

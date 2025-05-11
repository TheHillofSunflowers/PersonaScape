'use client';

import { useState } from 'react';
import Leaderboard from '@/components/Leaderboard';
import ViewsLeaderboard from '@/components/ViewsLeaderboard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LeaderboardPage() {
  const [limit, setLimit] = useState(10);
  const [activeTab, setActiveTab] = useState<'likes' | 'views'>('likes');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile Leaderboard</h1>
          <Link 
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Home
          </Link>
        </div>
        
        <p className="text-gray-600 mb-6">
          Discover the most popular profiles on PersonaScape.
        </p>
        
        {/* Tabs for switching between likes and views */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('likes')}
            className={`py-3 px-6 font-medium ${
              activeTab === 'likes' 
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Most Liked
          </button>
          <button
            onClick={() => setActiveTab('views')}
            className={`py-3 px-6 font-medium ${
              activeTab === 'views' 
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Most Viewed
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of profiles to show:
          </label>
          <div className="flex space-x-2">
            {[10, 20, 50, 100].map((value) => (
              <button
                key={value}
                onClick={() => setLimit(value)}
                className={`py-2 px-4 rounded ${
                  limit === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        
        {activeTab === 'likes' ? (
          <Leaderboard 
            limit={limit} 
            title="Most Liked Profiles" 
            className="mb-8"
          />
        ) : (
          <ViewsLeaderboard 
            limit={limit} 
            title="Most Viewed Profiles" 
            className="mb-8"
          />
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">About PersonaScape Metrics</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>Likes</strong> - Users can like profiles they enjoy. You need to be logged in to like a profile, and you cannot like your own profile.
            </p>
            <p>
              <strong>Views</strong> - Profile views are counted uniquely - multiple views from the same visitor on the same day only count once.
            </p>
            <p>
              Create your own profile today and start building your web presence!
            </p>
            <div className="pt-4">
              <Link 
                href="/signup"
                className="inline-block bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded"
              >
                Create Your Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
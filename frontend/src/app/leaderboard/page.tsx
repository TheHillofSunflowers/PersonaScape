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
              className="text-blue-400 font-medium border-b-2 border-blue-400 pb-1"
            >
              Leaderboard
            </Link>
            <Link 
              href="/dashboard"
              className="text-gray-400 hover:text-white transition"
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
          <h1 className="text-2xl font-bold mb-2">Profile Leaderboard</h1>
          <p className="text-gray-400">
            Discover the most popular profiles on PersonaScape.
          </p>
        </div>
        
        {/* Tabs for switching between likes and views */}
        <div className="flex mb-8">
          <button
            onClick={() => setActiveTab('likes')}
            className={`py-2 px-6 font-medium rounded-tl-md rounded-bl-md ${
              activeTab === 'likes' 
                ? 'bg-blue-500 text-white'
                : 'bg-[#23242b] text-gray-300 hover:bg-[#2a2b33] hover:text-white'
            }`}
          >
            Most Liked
          </button>
          <button
            onClick={() => setActiveTab('views')}
            className={`py-2 px-6 font-medium rounded-tr-md rounded-br-md ${
              activeTab === 'views' 
                ? 'bg-blue-500 text-white'
                : 'bg-[#23242b] text-gray-300 hover:bg-[#2a2b33] hover:text-white'
            }`}
          >
            Most Viewed
          </button>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of profiles to show:
          </label>
          <div className="flex space-x-2">
            {[10, 20, 50, 100].map((value) => (
              <button
                key={value}
                onClick={() => setLimit(value)}
                className={`py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  limit === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#23242b] text-gray-300 hover:bg-[#2a2b33] hover:text-white'
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
        
        <div className="bg-[#23242b] rounded-xl p-6 border border-[#32333c]">
          <h2 className="text-xl font-bold mb-4 text-white">About PersonaScape Metrics</h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start space-x-3">
              <span className="text-pink-400 text-lg">❤</span>
              <p>
                <strong className="text-white">Likes</strong> - Users can like profiles they enjoy. You need to be logged in to like a profile, and you cannot like your own profile.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 text-lg">👁️</span>
              <p>
                <strong className="text-white">Views</strong> - Profile views are counted uniquely - multiple views from the same visitor on the same day only count once.
              </p>
            </div>
            <p className="pt-2">
              Create your own profile today and start building your web presence!
            </p>
            <div className="pt-4">
              <Link 
                href="/signup"
                className="inline-block bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-md transition-colors"
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
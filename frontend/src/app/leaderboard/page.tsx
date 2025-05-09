'use client';

import { useState } from 'react';
import Leaderboard from '@/components/Leaderboard';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [limit, setLimit] = useState(10);

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
        
        <p className="text-gray-600 mb-8">
          Discover the most popular profiles on PersonaScape based on likes.
        </p>
        
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
        
        <Leaderboard 
          limit={limit} 
          title="Most Popular Profiles" 
          className="mb-8"
        />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">About Likes</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              The leaderboard ranks profiles based on the number of likes they have received.
            </p>
            <p>
              To like a profile, you need to be logged in. You can like any profile except your own.
            </p>
            <p>
              Create your own profile today and start collecting likes!
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
'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/lib/likes-api';
import Link from 'next/link';
import LikeButton from './LikeButton';
import Image from 'next/image';

interface LeaderboardProfile {
  id: number;
  userId: number;
  username: string;
  bio: string | null;
  theme: string | null;
  likesCount: number;
  profilePicture?: string | null;
}

interface LeaderboardProps {
  limit?: number;
  className?: string;
  title?: string;
}

export default function Leaderboard({
  limit = 10,
  className = '',
  title = 'Top Profiles'
}: LeaderboardProps) {
  const [profiles, setProfiles] = useState<LeaderboardProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard(limit);
        setProfiles(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [limit]);

  if (loading) {
    return (
      <div className={`p-6 rounded-xl shadow-card bg-accent-50 dark:bg-accent-800 ${className}`}>
        <h2 className="text-2xl font-heading font-bold mb-6 text-accent-800 dark:text-white">{title}</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-xl shadow-card bg-accent-50 dark:bg-accent-800 ${className}`}>
        <h2 className="text-2xl font-heading font-bold mb-6 text-accent-800 dark:text-white">{title}</h2>
        <div className="p-6 text-center rounded-lg bg-red-100 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors shadow-button cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className={`p-6 rounded-xl shadow-card bg-accent-50 dark:bg-accent-800 ${className}`}>
        <h2 className="text-2xl font-heading font-bold mb-6 text-accent-800 dark:text-white">{title}</h2>
        <p className="text-accent-700 dark:text-accent-300 text-center py-8">No profiles found yet</p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl shadow-card bg-accent-50 dark:bg-accent-800 ${className} animate-fade-in`}>
      <h2 className="text-2xl font-heading font-bold mb-6 text-accent-800 dark:text-white">{title}</h2>
      <ul className="space-y-3">
        {profiles.map((profile, index) => (
          <li 
            key={profile.id}
            className={`flex items-center p-4 rounded-lg transition-all hover:bg-accent-200 dark:hover:bg-accent-700/70 
              ${index === 0 ? 'bg-gradient-to-r from-accent-100 to-primary-50 dark:from-primary-900/30 dark:to-secondary-900/30 border border-primary-200 dark:border-primary-700' : 'bg-accent-100 dark:bg-accent-700/40'}`}
          >
            <div className={`mr-4 font-bold text-lg w-8 text-center rounded-full h-8 flex items-center justify-center
              ${index === 0 ? 'bg-primary-600 text-white' : 
                index === 1 ? 'bg-primary-500 text-white' : 
                index === 2 ? 'bg-primary-400 text-white' : 
                'text-accent-700 dark:text-accent-300 bg-accent-200 dark:bg-accent-600'}`}
            >
              {index + 1}
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-accent-200 dark:bg-accent-600 mr-4 flex-shrink-0 shadow-soft">
              {profile.profilePicture ? (
                <Image 
                  src={profile.profilePicture} 
                  alt={`${profile.username}'s profile picture`}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 font-bold text-lg">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <Link 
                href={`/p/${profile.username}`}
                className="font-medium text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200 transition-colors text-lg cursor-pointer"
              >
                {profile.username}
              </Link>
              {profile.bio && (
                <p className="text-accent-700 dark:text-accent-300 text-sm mt-1 line-clamp-1">
                  {profile.bio}
                </p>
              )}
            </div>
            <div className="flex items-center ml-2">
              <LikeButton 
                profileId={profile.id} 
                initialLikesCount={profile.likesCount} 
                size="sm"
                username={profile.username}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 
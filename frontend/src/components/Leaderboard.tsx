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
      <div className={`card p-8 rounded-2xl shadow-card ${className}`}>
        <h2 className="text-2xl font-heading font-bold mb-6 text-brand-900 dark:text-brand-50">{title}</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`card p-8 rounded-2xl shadow-card ${className}`}>
        <h2 className="text-2xl font-heading font-bold mb-6 text-brand-900 dark:text-brand-50">{title}</h2>
        <div className="p-6 text-center rounded-xl bg-danger-100 dark:bg-danger-900/20">
          <p className="text-danger-700 dark:text-danger-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-button font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className={`card p-8 rounded-2xl shadow-card ${className}`}>
        <h2 className="text-2xl font-heading font-bold mb-6 text-brand-900 dark:text-brand-50">{title}</h2>
        <p className="text-brand-700 dark:text-brand-200 text-center py-8">No profiles found yet</p>
      </div>
    );
  }

  return (
    <div className={`card p-8 rounded-2xl shadow-card ${className} animate-fade-in`}>
      <h2 className="text-2xl font-heading font-bold mb-6 text-brand-900 dark:text-brand-50">{title}</h2>
      <ul className="space-y-3">
        {profiles.map((profile, index) => (
          <li 
            key={profile.id}
            className={`flex items-center p-4 rounded-xl transition-all group hover:shadow-lg hover:-translate-y-1 duration-150 bg-brand-50 dark:bg-brand-800/60 border border-brand-100 dark:border-brand-800 ${
              index === 0 ? 'bg-gradient-to-r from-primary-100 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 border-2 border-primary-300 dark:border-primary-700' :
              index === 1 ? 'bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 border border-primary-200 dark:border-primary-700' :
              'bg-brand-50 dark:bg-brand-800/60 border border-brand-100 dark:border-brand-800'}
            `}
          >
            <div className={`mr-4 font-bold text-lg w-8 text-center rounded-full h-8 flex items-center justify-center
              ${index === 0 ? 'bg-primary-600 text-white shadow-card' :
                index === 1 ? 'bg-primary-500 text-white' :
                index === 2 ? 'bg-primary-400 text-white' :
                'text-brand-700 dark:text-brand-200 bg-brand-200 dark:bg-brand-700'}
            `}>
              {index + 1}
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-200 dark:bg-brand-700 mr-4 flex-shrink-0 shadow-soft">
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
            <div className="flex-1 min-w-0">
              <Link 
                href={`/p/${profile.username}`}
                className="font-semibold text-primary-700 dark:text-primary-200 hover:text-primary-800 dark:hover:text-primary-100 transition-colors text-lg cursor-pointer truncate"
              >
                {profile.username}
              </Link>
              {profile.bio && (
                <p className="text-brand-700 dark:text-brand-200 text-sm mt-1 truncate">
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
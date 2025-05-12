'use client';

import { useState, useEffect } from 'react';
import { getLikedProfiles } from '@/lib/likes-api';
import Link from 'next/link';
import LikeButton from './LikeButton';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

interface ProfileSummary {
  id: number;
  userId: number;
  username: string;
  bio: string | null;
  theme: string | null;
  likesCount: number;
  likedAt: string;
  profilePicture?: string | null;
}

interface LikedProfilesProps {
  className?: string;
  title?: string;
}

export default function LikedProfiles({
  className = '',
  title = 'Profiles You Like'
}: LikedProfilesProps) {
  const { isAuthenticated, loading } = useAuth();
  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedProfiles = async () => {
      if (!isAuthenticated || loading) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await getLikedProfiles();
        setProfiles(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch liked profiles:', err);
        setError('Failed to load your liked profiles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedProfiles();
  }, [isAuthenticated, loading]);

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className={`p-4 rounded-xl shadow-lg bg-[#23242b] border border-[#32333c] ${className}`}>
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        <div className="p-4 text-center">
          <p className="text-gray-400">Please log in to see the profiles you&apos;ve liked</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`p-4 rounded-xl shadow-lg bg-[#23242b] border border-[#32333c] ${className}`}>
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-xl shadow-lg bg-[#23242b] border border-[#32333c] ${className}`}>
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        <div className="p-4 text-center text-red-400">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className={`p-4 rounded-xl shadow-lg bg-[#23242b] border border-[#32333c] ${className}`}>
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-gray-400 text-center py-4">You haven&apos;t liked any profiles yet</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl shadow-lg bg-[#23242b] border border-[#32333c] ${className}`}>
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      <ul className="space-y-3">
        {profiles.map((profile) => (
          <li 
            key={profile.id}
            className="flex items-center p-3 hover:bg-[#2a2b33] rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#32333c] mr-3 flex-shrink-0">
              {profile.profilePicture ? (
                <Image 
                  src={profile.profilePicture} 
                  alt={`${profile.username}'s profile picture`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#32333c] text-blue-400 font-bold">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <Link 
                href={`/p/${profile.username}`}
                className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
              >
                {profile.username}
              </Link>
              <p className="text-xs text-gray-400">
                Liked on {formatDate(profile.likedAt)}
              </p>
            </div>
            <div className="flex items-center">
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
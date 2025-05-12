'use client';

import { useState, useEffect } from 'react';
import { likeProfile, unlikeProfile, checkLikeStatus } from '@/lib/likes-api';
import { useAuth } from '@/hooks/useAuth';

interface LikeButtonProps {
  profileId: number;
  initialLikesCount?: number;
  showCount?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  username?: string;
}

export default function LikeButton({ 
  profileId, 
  initialLikesCount = 0, 
  showCount = true,
  className = '',
  size = 'md',
  username
}: LikeButtonProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Size classes for the button
  const sizeClasses = {
    sm: 'text-sm p-1',
    md: 'text-base p-2',
    lg: 'text-lg p-3'
  };

  // Check if this is the user's own profile
  useEffect(() => {
    if (user && username && user.username === username) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
  }, [user, username]);

  // Check initial like status when component mounts - only if user is authenticated
  useEffect(() => {
    const fetchLikeStatus = async () => {
      // Don't fetch like status if it's the user's own profile or if not authenticated
      if (!isAuthenticated || loading || isOwnProfile) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const status = await checkLikeStatus(profileId);
        setLiked(status.hasLiked);
        setLikesCount(status.likesCount);
        setError(null);
      } catch (err) {
        console.error('Failed to check like status:', err);
        setError('Failed to load like status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikeStatus();
  }, [profileId, isAuthenticated, loading, isOwnProfile]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      alert('Please log in to like profiles');
      return;
    }

    // Don't allow liking if it's the user's own profile - show tooltip instead
    if (isOwnProfile) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000); // Hide tooltip after 3 seconds
      return;
    }

    try {
      setIsLoading(true);
      
      if (liked) {
        // Unlike the profile
        const newCount = await unlikeProfile(profileId);
        setLikesCount(newCount);
        setLiked(false);
      } else {
        // Like the profile
        const newCount = await likeProfile(profileId);
        setLikesCount(newCount);
        setLiked(true);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to toggle like:', err);
      setError('Failed to update like status');
    } finally {
      setIsLoading(false);
    }
  };
  
  // If it's the user's own profile, show a disabled heart with tooltip
  if (isOwnProfile) {
    return (
      <div className={`flex items-center gap-2 ${className} relative`}>
        <button
          onClick={handleLikeToggle}
          className={`flex items-center justify-center rounded-full ${sizeClasses[size]} 
            text-accent-300 dark:text-accent-600 cursor-not-allowed`}
          aria-label="Cannot like your own profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </button>
        
        {showCount && (
          <span className="text-accent-500 dark:text-accent-400 font-medium">{likesCount}</span>
        )}
        
        {showTooltip && (
          <div className="absolute top-full right-0 mt-2 bg-accent-800 text-white text-xs rounded-md py-2 px-3 whitespace-nowrap z-10 shadow-soft">
            You cannot like your own profile
            <div className="absolute -top-1 right-2 w-2 h-2 bg-accent-800 rotate-45"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleLikeToggle}
        disabled={isLoading || !isAuthenticated}
        className={`flex items-center justify-center rounded-full transition-all ${sizeClasses[size]} 
          ${liked 
            ? 'text-secondary-600 dark:text-secondary-400 scale-110 hover:text-secondary-700 dark:hover:text-secondary-300' 
            : 'text-accent-400 dark:text-accent-500 hover:text-secondary-500 dark:hover:text-secondary-400 hover:scale-110'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label={liked ? 'Unlike profile' : 'Like profile'}
      >
        {isLoading ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-pulse">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        ) : (
          liked ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          )
        )}
      </button>
      
      {showCount && (
        <span className="text-accent-600 dark:text-accent-400 font-medium">{likesCount}</span>
      )}
      
      {error && (
        <span className="text-red-500 text-xs ml-2">{error}</span>
      )}
    </div>
  );
} 
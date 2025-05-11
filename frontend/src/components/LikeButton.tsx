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
      <div className={`flex items-center gap-1 ${className} relative`}>
        <button
          onClick={handleLikeToggle}
          className={`flex items-center justify-center rounded-full ${sizeClasses[size]} 
            text-gray-300 cursor-not-allowed`}
          aria-label="Cannot like your own profile"
        >
          <span>❤</span>
        </button>
        
        {showCount && (
          <span className="text-gray-600 text-sm">{likesCount} likes</span>
        )}
        
        {showTooltip && (
          <div className="absolute top-full right-0 mt-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            You cannot like your own profile
            <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={handleLikeToggle}
        disabled={isLoading || !isAuthenticated}
        className={`flex items-center justify-center rounded-full transition-colors ${sizeClasses[size]} 
          ${liked 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-red-500'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label={liked ? 'Unlike profile' : 'Like profile'}
      >
        {isLoading ? (
          <span className="animate-pulse">❤</span>
        ) : (
          <span>{liked ? '❤' : '♡'}</span>
        )}
      </button>
      
      {showCount && (
        <span className="text-gray-600 text-sm">{likesCount}</span>
      )}
      
      {error && (
        <span className="text-red-500 text-xs ml-2">{error}</span>
      )}
    </div>
  );
} 
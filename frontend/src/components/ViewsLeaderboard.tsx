import { useState, useEffect } from 'react';
import { getViewsLeaderboard, LeaderboardProfile } from '@/lib/views-api';
import Link from 'next/link';
import ViewCount from './ViewCount';
import Image from 'next/image';

interface ViewsLeaderboardProps {
  limit?: number;
  className?: string;
  title?: string;
}

export default function ViewsLeaderboard({
  limit = 10,
  className = '',
  title = 'Most Viewed Profiles'
}: ViewsLeaderboardProps) {
  const [profiles, setProfiles] = useState<LeaderboardProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getViewsLeaderboard(limit);
        setProfiles(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch views leaderboard:', err);
        setError('Failed to load views leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [limit]);

  if (loading) {
    return (
      <div className={`p-4 rounded-lg shadow-md bg-white ${className}`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg shadow-md bg-white ${className}`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="p-4 text-center text-red-500">
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
      <div className={`p-4 rounded-lg shadow-md bg-white ${className}`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-500 text-center py-4">No profiles found</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg shadow-md bg-white ${className}`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <ul className="space-y-3">
        {profiles.map((profile, index) => (
          <li 
            key={profile.profileId}
            className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="mr-3 font-bold text-lg text-gray-500 w-8 text-center">
              {index + 1}
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
              {profile.profilePicture ? (
                <Image 
                  src={profile.profilePicture} 
                  alt={`${profile.username}'s profile picture`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 font-bold">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <Link 
                href={`/p/${profile.username}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {profile.username}
              </Link>
            </div>
            <div className="flex items-center">
              <ViewCount 
                count={profile.viewsCount} 
                size="sm"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 
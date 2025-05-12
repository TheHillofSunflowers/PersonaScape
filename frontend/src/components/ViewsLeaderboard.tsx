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
      <div className={`bg-[#23242b] p-6 rounded-xl border border-[#32333c] shadow-lg ${className}`}>
        <h2 className="text-xl font-bold mb-6 text-white">{title}</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-[#23242b] p-6 rounded-xl border border-[#32333c] shadow-lg ${className}`}>
        <h2 className="text-xl font-bold mb-6 text-white">{title}</h2>
        <div className="p-6 text-center rounded-xl bg-red-900/20 border border-red-800">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className={`bg-[#23242b] p-6 rounded-xl border border-[#32333c] shadow-lg ${className}`}>
        <h2 className="text-xl font-bold mb-6 text-white">{title}</h2>
        <p className="text-gray-400 text-center py-8">No profiles found</p>
      </div>
    );
  }

  return (
    <div className={`bg-[#23242b] p-6 rounded-xl border border-[#32333c] shadow-lg ${className}`}>
      <h2 className="text-xl font-bold mb-6 text-white">{title}</h2>
      <ul className="space-y-3">
        {profiles.map((profile, index) => (
          <li 
            key={profile.profileId}
            className={`flex items-center p-4 rounded-lg transition-all hover:bg-[#2a2b33] border border-[#32333c] ${
              index === 0 ? 'bg-blue-900/20 border-blue-800' : 
              index === 1 ? 'bg-blue-900/10 border-blue-800/70' : 
              'bg-[#23242b]'
            }`}
          >
            <div className={`mr-4 font-bold text-lg w-8 h-8 text-center rounded-md flex items-center justify-center
              ${index === 0 ? 'bg-blue-500 text-white' : 
                index === 1 ? 'bg-blue-600/80 text-white' : 
                index === 2 ? 'bg-blue-700/80 text-white' : 
                'text-gray-400 bg-[#2a2b33]'}
            `}>
              {index + 1}
            </div>
            <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 flex-shrink-0 border border-[#32333c]">
              {profile.profilePicture ? (
                <Image 
                  src={profile.profilePicture} 
                  alt={`${profile.username}'s profile picture`}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#3a3b44] text-blue-300 font-bold text-lg">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <Link 
                href={`/p/${profile.username}`}
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors text-lg cursor-pointer"
              >
                {profile.username}
              </Link>
            </div>
            <div className="flex items-center">
              <ViewCount 
                count={profile.viewsCount} 
                size="sm"
                className="text-blue-400"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 
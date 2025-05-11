import api from './api';

interface LikeStatus {
  hasLiked: boolean;
  likesCount: number;
}

interface ProfileSummary {
  id: number;
  userId: number;
  username: string;
  bio: string | null;
  theme: string | null;
  likesCount: number;
  likedAt: string;
}

interface LeaderboardProfile {
  id: number;
  userId: number;
  username: string;
  bio: string | null;
  theme: string | null;
  likesCount: number;
}

// Like a profile
export const likeProfile = async (profileId: number): Promise<number> => {
  try {
    const response = await api.post<{ message: string, likesCount: number }>(`/api/likes/profile/${profileId}`);
    return response.data.likesCount;
  } catch (error) {
    console.error('Error liking profile:', error);
    throw error;
  }
};

// Unlike a profile
export const unlikeProfile = async (profileId: number): Promise<number> => {
  try {
    const response = await api.delete<{ message: string, likesCount: number }>(`/api/likes/profile/${profileId}`);
    return response.data.likesCount;
  } catch (error) {
    console.error('Error unliking profile:', error);
    throw error;
  }
};

// Check if user has liked a profile
export const checkLikeStatus = async (profileId: number): Promise<LikeStatus> => {
  try {
    const response = await api.get<LikeStatus>(`/api/likes/check/${profileId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking like status:', error);
    // Return a default response instead of throwing
    return { hasLiked: false, likesCount: 0 };
  }
};

// Get profiles liked by the user
export const getLikedProfiles = async (): Promise<ProfileSummary[]> => {
  try {
    const response = await api.get<ProfileSummary[]>('/likes/user');
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error getting liked profiles:', error);
    // Return an empty array instead of throwing
    return [];
  }
};

// Get leaderboard of most liked profiles
export const getLeaderboard = async (limit: number = 10): Promise<LeaderboardProfile[]> => {
  try {
    // Use a public endpoint that doesn't require authentication
    const response = await api.get<LeaderboardProfile[]>(`/public/leaderboard?limit=${limit}`);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    // Return an empty array instead of throwing
    return [];
  }
}; 
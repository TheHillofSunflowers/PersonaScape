import api from './api';
import { encodeUsername } from './imageUtils';

export interface ViewsResponse {
  message: string;
  viewsCount: number;
}

export interface ViewStats {
  viewsCount: number;
  username: string;
  totalViews?: number;
  uniqueViewers?: number;
  viewsByDate?: Record<string, number>;
  recentViews?: Array<{
    lastViewedAt: string;
    viewCount: number;
    userAgent?: string;
  }>;
}

export interface LeaderboardProfile {
  username: string;
  profileId: number;
  viewsCount: number;
  profilePicture?: string | null;
}

/**
 * Record a view for a profile
 */
export async function recordProfileView(username: string): Promise<number> {
  try {
    // Don't re-encode if the username already has URL encoding
    const encodedUsername = username.includes('%20') ? username : encodeUsername(username);
    
    const response = await api.post<ViewsResponse>(
      `/views/profile/${encodedUsername}`
    );
    return response.data.viewsCount;
  } catch (error) {
    console.error('Error recording profile view:', error);
    return 0; // Return 0 as a fallback
  }
}

/**
 * Get view statistics for a profile
 */
export async function getProfileViewStats(username: string): Promise<ViewStats> {
  try {
    // Don't re-encode if the username already has URL encoding
    const encodedUsername = username.includes('%20') ? username : encodeUsername(username);
    
    const response = await api.get<ViewStats>(`/views/profile/${encodedUsername}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error getting profile view stats:', error);
    // Return a default object with 0 views if request fails
    return {
      viewsCount: 0,
      username
    };
  }
}

/**
 * Get the most viewed profiles
 */
export async function getViewsLeaderboard(limit: number = 10): Promise<LeaderboardProfile[]> {
  try {
    const response = await api.get<LeaderboardProfile[]>('/views/leaderboard', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching views leaderboard:', error);
    return []; // Return empty array as fallback
  }
} 
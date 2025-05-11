import { Request, Response, NextFunction } from 'express';
import prisma from '../prismaClient';

// Interface for authenticated request with userId
interface AuthRequest extends Request {
  userId?: string;
}

// Define custom interfaces to match Prisma models
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface Profile {
  id: number;
  userId: number;
  bio?: string | null;
  hobbies?: string | null;
  socialLinks?: any;
  customHtml?: string | null;
  theme?: string | null;
  likesCount: number;
  User?: User;
  profilePicture?: string | null;
}

// Define ProfileLike type since Prisma hasn't generated it yet
interface ProfileLike {
  id: number;
  profileId: number;
  userId: number;
  createdAt: Date;
  profile?: Profile;
}

/**
 * Like a profile
 * POST /api/likes/profile/:profileId
 */
export const likeProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId;
    const { profileId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userIdNum = parseInt(userId);
    const profileIdNum = parseInt(profileId);

    // Check if profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: profileIdNum }
    });

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    // Check if user is trying to like their own profile
    if (profile.userId === userIdNum) {
      res.status(400).json({ error: 'Cannot like your own profile' });
      return;
    }

    // Check if the user already liked this profile
    const existingLike = await prisma.profileLike.findUnique({
      where: {
        profileId_userId: {
          profileId: profileIdNum,
          userId: userIdNum
        }
      }
    });

    if (existingLike) {
      res.status(400).json({ error: 'Profile already liked' });
      return;
    }

    // Create like with Prisma client
    await prisma.profileLike.create({
      data: {
        profileId: profileIdNum,
        userId: userIdNum
      }
    });

    // Increment the likes count on the profile
    const updatedProfile = await prisma.profile.update({
      where: { id: profileIdNum },
      data: { likesCount: { increment: 1 } }
    });

    res.status(201).json({ 
      message: 'Profile liked successfully',
      likesCount: updatedProfile.likesCount
    });
  } catch (err) {
    console.error('Error in likeProfile:', err);
    next(err);
  }
};

/**
 * Unlike a profile
 * DELETE /api/likes/profile/:profileId
 */
export const unlikeProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId;
    const { profileId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userIdNum = parseInt(userId);
    const profileIdNum = parseInt(profileId);

    // Check if profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: profileIdNum }
    });

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    // Check if the like exists
    const existingLike = await prisma.profileLike.findUnique({
      where: {
        profileId_userId: {
          profileId: profileIdNum,
          userId: userIdNum
        }
      }
    });

    if (!existingLike) {
      res.status(400).json({ error: 'Profile not liked yet' });
      return;
    }

    // Delete the like
    await prisma.profileLike.delete({
      where: {
        profileId_userId: {
          profileId: profileIdNum,
          userId: userIdNum
        }
      }
    });

    // Decrement the likes count on the profile
    const updatedProfile = await prisma.profile.update({
      where: { id: profileIdNum },
      data: {
        likesCount: {
          decrement: 1
        }
      }
    });

    res.json({ 
      message: 'Profile unliked successfully',
      likesCount: updatedProfile.likesCount
    });
  } catch (err) {
    console.error('Error in unlikeProfile:', err);
    next(err);
  }
};

/**
 * Check if user has liked a profile
 * GET /api/likes/check/:profileId
 */
export const checkLikeStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId;
    const { profileId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userIdNum = parseInt(userId);
    const profileIdNum = parseInt(profileId);

    // Check if like exists
    const existingLike = await prisma.profileLike.findUnique({
      where: {
        profileId_userId: {
          profileId: profileIdNum,
          userId: userIdNum
        }
      }
    });

    // Get the profile to check its likes count
    const profile = await prisma.profile.findUnique({
      where: { id: profileIdNum }
    });

    res.json({
      hasLiked: !!existingLike,
      likesCount: profile?.likesCount || 0
    });
  } catch (err) {
    console.error('Error in checkLikeStatus:', err);
    next(err);
  }
};

/**
 * Get profiles liked by the user
 * GET /api/likes/user
 */
export const getLikedProfiles = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userIdNum = parseInt(userId);

    // Use Prisma to get the liked profiles with their user information
    const likedProfiles = await prisma.profileLike.findMany({
      where: {
        userId: userIdNum
      },
      include: {
        profile: {
          include: {
            User: {
              select: {
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the results for the response
    const formattedProfiles = likedProfiles.map(like => ({
      id: like.profile.id,
      userId: like.profile.userId,
      bio: like.profile.bio,
      theme: like.profile.theme,
      likesCount: like.profile.likesCount,
      username: like.profile.User?.username,
      likedAt: like.createdAt,
      profilePicture: like.profile.profilePicture
    }));

    res.json({
      likedProfiles: formattedProfiles
    });
  } catch (err) {
    console.error('Error in getLikedProfiles:', err);
    next(err);
  }
};

/**
 * Get leaderboard of most liked profiles
 * GET /api/likes/leaderboard
 */
export const getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get the top profiles by likes count
    const topProfiles = await prisma.profile.findMany({
      where: {
        likesCount: {
          gt: 0
        }
      },
      include: {
        User: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        likesCount: 'desc'
      },
      take: 10 // Limit to top 10
    });

    // Format the results
    const leaderboard = topProfiles.map(profile => ({
      id: profile.id,
      userId: profile.userId,
      username: profile.User?.username,
      likesCount: profile.likesCount,
      theme: profile.theme,
      profilePicture: profile.profilePicture
    }));

    res.json({
      leaderboard
    });
  } catch (err) {
    console.error('Error in getLeaderboard:', err);
    next(err);
  }
}; 
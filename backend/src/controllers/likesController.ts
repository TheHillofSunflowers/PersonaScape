import { Request, Response, NextFunction } from 'express';
import prisma from '../prismaClient';
import { Profile, User, Prisma } from '@prisma/client';

// Interface for authenticated request with userId
interface AuthRequest extends Request {
  userId?: string;
}

// Define types for profile with user data
interface ProfileWithUser extends Profile {
  User: User;
}

// Define ProfileLike type since Prisma hasn't generated it yet
interface ProfileLike {
  id: number;
  profileId: number;
  userId: number;
  createdAt: Date;
  profile: ProfileWithUser;
}

/**
 * Like a profile
 * POST /api/likes/profile/:profileId
 */
export const likeProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { profileId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userIdNum = parseInt(userId);
    const profileIdNum = parseInt(profileId);

    // Check if profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: profileIdNum }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check if user is trying to like their own profile
    if (profile.userId === userIdNum) {
      return res.status(400).json({ error: 'Cannot like your own profile' });
    }

    // Check if the user and profile exist with a manual query to avoid schema issues
    const existingLike = await prisma.$queryRaw`
      SELECT * FROM "ProfileLike" 
      WHERE "profileId" = ${profileIdNum} AND "userId" = ${userIdNum}
    `;

    if (Array.isArray(existingLike) && existingLike.length > 0) {
      return res.status(400).json({ error: 'Profile already liked' });
    }

    // Create like with a manual query
    await prisma.$executeRaw`
      INSERT INTO "ProfileLike" ("profileId", "userId", "createdAt") 
      VALUES (${profileIdNum}, ${userIdNum}, ${new Date()})
    `;

    // Increment the likes count on the profile - use direct update instead of object spread
    const updatedProfile = await prisma.$executeRaw`
      UPDATE "Profile" 
      SET "likesCount" = "likesCount" + 1 
      WHERE "id" = ${profileIdNum}
    `;

    // Get the updated profile to return the correct counts
    const refreshedProfile = await prisma.profile.findUnique({
      where: { id: profileIdNum }
    });

    res.status(201).json({ 
      message: 'Profile liked successfully',
      likesCount: refreshedProfile?.likesCount || 0
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
export const unlikeProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { profileId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userIdNum = parseInt(userId);
    const profileIdNum = parseInt(profileId);

    // Check if profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: profileIdNum }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check if the like exists with a raw query
    const existingLike = await prisma.$queryRaw`
      SELECT * FROM "ProfileLike" 
      WHERE "profileId" = ${profileIdNum} AND "userId" = ${userIdNum}
    `;

    if (!(Array.isArray(existingLike) && existingLike.length > 0)) {
      return res.status(400).json({ error: 'Profile not liked yet' });
    }

    // Delete the like with a raw query
    await prisma.$executeRaw`
      DELETE FROM "ProfileLike" 
      WHERE "profileId" = ${profileIdNum} AND "userId" = ${userIdNum}
    `;

    // Decrement the likes count on the profile - use direct SQL to avoid type issues
    await prisma.$executeRaw`
      UPDATE "Profile" 
      SET "likesCount" = GREATEST(0, "likesCount" - 1) 
      WHERE "id" = ${profileIdNum}
    `;

    // Get the updated profile to return the correct counts
    const refreshedProfile = await prisma.profile.findUnique({
      where: { id: profileIdNum }
    });

    res.json({ 
      message: 'Profile unliked successfully',
      likesCount: refreshedProfile?.likesCount || 0
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
export const checkLikeStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { profileId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userIdNum = parseInt(userId);
    const profileIdNum = parseInt(profileId);

    // Check if like exists with a raw query
    const existingLike = await prisma.$queryRaw`
      SELECT * FROM "ProfileLike" 
      WHERE "profileId" = ${profileIdNum} AND "userId" = ${userIdNum}
    `;

    // Get the profile to check its likes count
    const profile = await prisma.profile.findUnique({
      where: { id: profileIdNum }
    });

    res.json({
      hasLiked: Array.isArray(existingLike) && existingLike.length > 0,
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
export const getLikedProfiles = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userIdNum = parseInt(userId);

    // Use a raw query to get the data we need
    const likedProfiles = await prisma.$queryRaw`
      SELECT 
        pl."id" as "likeId",
        pl."createdAt" as "likedAt",
        p."id" as "profileId",
        p."userId",
        p."bio",
        p."theme",
        p."likesCount",
        u."username"
      FROM "ProfileLike" pl
      JOIN "Profile" p ON pl."profileId" = p."id"
      JOIN "User" u ON p."userId" = u."id"
      WHERE pl."userId" = ${userIdNum}
      ORDER BY pl."createdAt" DESC
    `;

    // Format the results for the response
    const formattedProfiles = Array.isArray(likedProfiles) ? likedProfiles.map((like: any) => ({
      id: like.profileId,
      userId: like.userId,
      username: like.username,
      bio: like.bio,
      theme: like.theme,
      likesCount: like.likesCount || 0,
      likedAt: like.likedAt
    })) : [];

    res.json(formattedProfiles);
  } catch (err) {
    console.error('Error in getLikedProfiles:', err);
    next(err);
  }
};

/**
 * Get most liked profiles (leaderboard)
 * GET /api/likes/leaderboard
 */
export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get limit from query params or use default
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    // Use a raw query to get the top profiles by likes
    const topProfiles = await prisma.$queryRaw`
      SELECT 
        p."id",
        p."userId",
        p."bio",
        p."theme",
        p."likesCount",
        u."username"
      FROM "Profile" p
      JOIN "User" u ON p."userId" = u."id"
      WHERE p."likesCount" > 0
      ORDER BY p."likesCount" DESC
      LIMIT ${limit}
    `;

    // Format the response
    const leaderboard = Array.isArray(topProfiles) ? topProfiles.map((profile: any) => ({
      id: profile.id,
      username: profile.username,
      bio: profile.bio,
      likesCount: profile.likesCount || 0,
      theme: profile.theme || 'default'
    })) : [];

    res.json(leaderboard);
  } catch (err) {
    console.error('Error in getLeaderboard:', err);
    next(err);
  }
}; 
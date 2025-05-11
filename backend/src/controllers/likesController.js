const prisma = require('../prismaClient');

/**
 * Like a profile
 * POST /api/likes/profile/:profileId
 */
const likeProfile = async (req, res, next) => {
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

    try {
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
        likesCount: updatedProfile.likesCount || 1
      });
    } catch (dbError) {
      // If there's an error with likesCount column (P2022)
      if (dbError.code === 'P2022' && dbError.meta?.column?.includes('likesCount')) {
        console.log('likesCount column does not exist yet, creating like without updating count');
        
        // Just create the like without incrementing a non-existent column
        await prisma.profileLike.create({
          data: {
            profileId: profileIdNum,
            userId: userIdNum
          }
        });

        // Return success with default count
        res.status(201).json({ 
          message: 'Profile liked successfully (likesCount not available)',
          likesCount: 1
        });
      } else {
        throw dbError; // rethrow if it's a different error
      }
    }
  } catch (err) {
    console.error('Error in likeProfile:', err);
    res.status(500).json({ error: 'Failed to like profile' });
  }
};

/**
 * Unlike a profile
 * DELETE /api/likes/profile/:profileId
 */
const unlikeProfile = async (req, res, next) => {
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

    try {
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
        likesCount: updatedProfile.likesCount || 0
      });
    } catch (dbError) {
      // If there's an error with likesCount column (P2022)
      if (dbError.code === 'P2022' && dbError.meta?.column?.includes('likesCount')) {
        console.log('likesCount column does not exist yet, unlinking without updating count');
        
        // Just delete the like without decrementing a non-existent column
        await prisma.profileLike.delete({
          where: {
            profileId_userId: {
              profileId: profileIdNum,
              userId: userIdNum
            }
          }
        });

        // Return success with default count
        res.json({ 
          message: 'Profile unliked successfully (likesCount not available)',
          likesCount: 0
        });
      } else {
        throw dbError; // rethrow if it's a different error
      }
    }
  } catch (err) {
    console.error('Error in unlikeProfile:', err);
    res.status(500).json({ error: 'Failed to unlike profile' });
  }
};

/**
 * Check if user has liked a profile
 * GET /api/likes/check/:profileId
 */
const checkLikeStatus = async (req, res, next) => {
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
    let hasLiked = false;
    try {
      const existingLike = await prisma.profileLike.findUnique({
        where: {
          profileId_userId: {
            profileId: profileIdNum,
            userId: userIdNum
          }
        }
      });
      hasLiked = !!existingLike;
    } catch (error) {
      console.log('Error checking like status, assuming ProfileLike table missing:', error);
      // If table doesn't exist, assume not liked
      hasLiked = false;
    }

    // Get the profile to check its likes count
    let likesCount = 0;
    try {
      const profile = await prisma.profile.findUnique({
        where: { id: profileIdNum }
      });
      likesCount = profile?.likesCount || 0;
    } catch (error) {
      console.log('Error getting likes count, assuming likesCount column missing:', error);
      // If likesCount doesn't exist, fallback to 0
      likesCount = 0;
    }

    res.json({
      hasLiked,
      likesCount
    });
  } catch (err) {
    console.error('Error in checkLikeStatus:', err);
    res.status(500).json({ error: 'Failed to check like status' });
  }
};

/**
 * Get profiles liked by the user
 * GET /api/likes/user
 */
const getLikedProfiles = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userIdNum = parseInt(userId);

    try {
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
        bio: like.profile.bio || '',
        theme: like.profile.theme || 'default',
        likesCount: like.profile.likesCount || 0,
        username: like.profile.User?.username,
        likedAt: like.createdAt,
        profilePicture: like.profile.profilePicture || null
      }));

      res.json({
        likedProfiles: formattedProfiles
      });
    } catch (dbError) {
      // Check if the error is because the table doesn't exist
      if (dbError.code === 'P2021' || dbError.code === 'P2022') {
        console.log(`Database structure issue: ${dbError.code} - ${dbError.message}, returning empty array`);
        // Return empty array if table or column doesn't exist yet
        res.json({
          likedProfiles: []
        });
      } else {
        throw dbError; // rethrow for other errors
      }
    }
  } catch (err) {
    console.error('Error in getLikedProfiles:', err);
    res.status(500).json({ error: 'Failed to retrieve liked profiles' });
  }
};

/**
 * Get leaderboard of most liked profiles
 * GET /api/likes/leaderboard
 */
const getLeaderboard = async (req, res, next) => {
  try {
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
        theme: profile.theme || 'default',
        profilePicture: profile.profilePicture || null
      }));

      res.json({
        leaderboard
      });
    } catch (dbError) {
      // Check if the error is because of missing columns
      if (dbError.code === 'P2022') {
        console.log(`Column doesn't exist: ${dbError.meta?.column}, returning empty leaderboard`);
        
        // Return empty leaderboard if necessary columns don't exist yet
        res.json({
          leaderboard: []
        });
      } else {
        throw dbError; // rethrow for other errors
      }
    }
  } catch (err) {
    console.error('Error in getLeaderboard:', err);
    res.status(500).json({ error: 'Failed to retrieve leaderboard' });
  }
};

module.exports = {
  likeProfile,
  unlikeProfile,
  checkLikeStatus,
  getLikedProfiles,
  getLeaderboard
}; 
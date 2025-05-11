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
        bio: like.profile.bio,
        theme: like.profile.theme,
        likesCount: like.profile.likesCount,
        username: like.profile.User?.username,
        likedAt: like.createdAt,
        profilePicture: like.profile.profilePicture || null
      }));

      res.json({
        likedProfiles: formattedProfiles
      });
    } catch (dbError) {
      // Check if the error is because the table doesn't exist
      if (dbError.code === 'P2021' && dbError.meta?.table?.includes('ProfileLike')) {
        console.log('ProfileLike table does not exist yet, returning empty array');
        // Return empty array if table doesn't exist yet
        res.json({
          likedProfiles: []
        });
      } else {
        throw dbError; // rethrow for other errors
      }
    }
  } catch (err) {
    console.error('Error in getLikedProfiles:', err);
    next(err);
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
        theme: profile.theme,
        profilePicture: profile.profilePicture || null
      }));

      res.json({
        leaderboard
      });
    } catch (dbError) {
      // Check if the error is because the column doesn't exist
      if (dbError.code === 'P2022' && dbError.meta?.column === 'profilePicture') {
        console.log('profilePicture column does not exist yet, returning leaderboard without it');
        
        // Retry without expecting the profilePicture column
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

        // Format the results without profilePicture
        const leaderboard = topProfiles.map(profile => ({
          id: profile.id,
          userId: profile.userId,
          username: profile.User?.username,
          likesCount: profile.likesCount,
          theme: profile.theme,
          profilePicture: null // Add null as default
        }));

        res.json({
          leaderboard
        });
      } else {
        throw dbError; // rethrow for other errors
      }
    }
  } catch (err) {
    console.error('Error in getLeaderboard:', err);
    next(err);
  }
};

module.exports = {
  likeProfile,
  unlikeProfile,
  checkLikeStatus,
  getLikedProfiles,
  getLeaderboard
}; 
const prisma = require('../prismaClient');

/**
 * Record a view for a profile
 * POST /api/views/profile/:username
 */
const recordProfileView = async (req, res, next) => {
  try {
    const { username } = req.params;
    const userId = req.userId || null; // Authenticated user ID or null for anonymous
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || null;
    
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profileId = user.profile.id;
    
    // Don't count views of your own profile
    if (userId && user.id === parseInt(userId)) {
      return res.status(200).json({ 
        message: 'Own profile view not counted',
        viewsCount: user.profile.viewsCount || 0
      });
    }

    try {
      // Try to find an existing view record
      const existingView = await prisma.profileView.findUnique({
        where: {
          profileId_viewerId_ipAddress: {
            profileId,
            viewerId: userId ? parseInt(userId) : null,
            ipAddress
          }
        }
      });

      let updatedProfile;

      if (existingView) {
        // If the last view was more than 24 hours ago, count as a new view
        const hoursSinceLastView = (new Date() - existingView.lastViewedAt) / (1000 * 60 * 60);
        
        if (hoursSinceLastView >= 24) {
          // Update the view record and increment count
          await prisma.profileView.update({
            where: {
              id: existingView.id
            },
            data: {
              lastViewedAt: new Date(),
              viewCount: { increment: 1 }
            }
          });
          
          // Also increment the total views count on the profile
          updatedProfile = await prisma.profile.update({
            where: { id: profileId },
            data: { viewsCount: { increment: 1 } }
          });
        } else {
          // Just update the last viewed time without counting as a new view
          await prisma.profileView.update({
            where: {
              id: existingView.id
            },
            data: {
              lastViewedAt: new Date()
            }
          });
          
          // Return current view count without incrementing
          updatedProfile = user.profile;
        }
      } else {
        // Create a new view record
        await prisma.profileView.create({
          data: {
            profileId,
            viewerId: userId ? parseInt(userId) : null,
            ipAddress,
            userAgent,
            viewCount: 1,
            lastViewedAt: new Date()
          }
        });
        
        // Increment the views count on the profile
        updatedProfile = await prisma.profile.update({
          where: { id: profileId },
          data: { viewsCount: { increment: 1 } }
        });
      }
      
      return res.status(200).json({
        message: 'Profile view recorded',
        viewsCount: updatedProfile.viewsCount
      });
    } catch (dbError) {
      // If viewsCount column doesn't exist yet
      if (dbError.code === 'P2022' && dbError.meta?.column?.includes('viewsCount')) {
        console.log('viewsCount column does not exist yet');
        
        // Just create the view record without updating count
        await prisma.profileView.create({
          data: {
            profileId,
            viewerId: userId ? parseInt(userId) : null,
            ipAddress,
            userAgent,
            viewCount: 1,
            lastViewedAt: new Date()
          }
        });
        
        return res.status(200).json({
          message: 'Profile view recorded (viewsCount not available)',
          viewsCount: 1
        });
      } else {
        throw dbError;
      }
    }
  } catch (err) {
    console.error('Error in recordProfileView:', err);
    res.status(500).json({ error: 'Failed to record profile view' });
  }
};

/**
 * Get profile view statistics
 * GET /api/views/profile/:username/stats
 */
const getProfileViewStats = async (req, res, next) => {
  try {
    const { username } = req.params;
    const userId = req.userId;

    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Only allow the profile owner to see detailed stats
    const isOwner = userId && user.id === parseInt(userId);
    const profileId = user.profile.id;

    // Basic stats accessible to everyone
    const basicStats = {
      viewsCount: user.profile.viewsCount || 0,
      username: user.username
    };

    // If not the owner, return just the basic stats
    if (!isOwner) {
      return res.json(basicStats);
    }

    // For the owner, provide detailed stats
    const viewsOverTime = await prisma.profileView.findMany({
      where: { profileId },
      orderBy: { lastViewedAt: 'desc' },
      select: {
        lastViewedAt: true,
        viewCount: true,
        createdAt: true,
        userAgent: true
      }
    });

    // Calculate some aggregate stats
    const totalViews = user.profile.viewsCount || 0;
    const uniqueViewers = await prisma.profileView.count({
      where: { profileId }
    });

    // Group views by date for a time series
    const viewsByDate = viewsOverTime.reduce((acc, view) => {
      const date = view.lastViewedAt.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {});

    // Return detailed stats
    return res.json({
      ...basicStats,
      totalViews,
      uniqueViewers,
      viewsByDate,
      recentViews: viewsOverTime.slice(0, 10) // Last 10 views
    });
  } catch (err) {
    console.error('Error in getProfileViewStats:', err);
    res.status(500).json({ error: 'Failed to get profile view statistics' });
  }
};

/**
 * Get views leaderboard
 * GET /api/views/leaderboard
 */
const getViewsLeaderboard = async (req, res, next) => {
  try {
    // Get profiles ordered by viewsCount
    const leaderboard = await prisma.profile.findMany({
      select: {
        id: true,
        viewsCount: true,
        User: {
          select: {
            username: true
          }
        },
        profilePicture: true
      },
      orderBy: {
        viewsCount: 'desc'
      },
      take: 10 // Get top 10
    });

    // Format the response
    const formattedLeaderboard = leaderboard.map(entry => ({
      username: entry.User.username,
      profileId: entry.id,
      viewsCount: entry.viewsCount,
      profilePicture: entry.profilePicture
    }));

    res.json(formattedLeaderboard);
  } catch (err) {
    console.error('Error in getViewsLeaderboard:', err);
    res.status(500).json({ error: 'Failed to get views leaderboard' });
  }
};

module.exports = {
  recordProfileView,
  getProfileViewStats,
  getViewsLeaderboard
}; 
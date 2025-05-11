const prisma = require('../prismaClient');

// GET /profile/:username
const getProfile = async (req, res, next) => {
  const { username } = req.params;
  try {
    console.log(`Getting profile for username: ${username}`);
    
    const user = await prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!user) {
      console.log(`User not found: ${username}`);
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    // Format the profile data with fallbacks for missing columns
    const profileData = {
      id: user.profile?.id,
      userId: user.profile?.userId,
      bio: user.profile?.bio || '',
      hobbies: user.profile?.hobbies || '',
      socialLinks: user.profile?.socialLinks || {},
      customHtml: user.profile?.customHtml || '',
      theme: user.profile?.theme || 'default',
      username: user.username,
      likesCount: user.profile?.likesCount || 0,
      profilePicture: user.profile?.profilePicture || null
    };

    console.log('Sending profile data:', profileData);
    res.json(profileData);
  } catch (error) {
    console.error('Error in getProfile:', error);
    
    // Check if error is due to missing columns
    if (error.code === 'P2022') {
      console.log('Missing column in database, returning profile without it');
      
      try {
        // Retry with minimal fields
        const user = await prisma.user.findUnique({
          where: { username },
          select: {
            username: true,
            profile: {
              select: {
                id: true,
                userId: true,
                bio: true,
                hobbies: true,
                socialLinks: true,
                customHtml: true,
                theme: true,
              }
            }
          }
        });
        
        if (!user) {
          res.status(404).json({ error: 'Profile not found' });
          return;
        }
        
        // Return profile with default values for missing fields
        const profileData = {
          id: user.profile?.id,
          userId: user.profile?.userId,
          bio: user.profile?.bio || '',
          hobbies: user.profile?.hobbies || '',
          socialLinks: user.profile?.socialLinks || {},
          customHtml: user.profile?.customHtml || '',
          theme: user.profile?.theme || 'default',
          username: user.username,
          likesCount: 0,
          profilePicture: null
        };
        
        res.json(profileData);
        return;
      } catch (retryError) {
        console.error('Error in getProfile retry:', retryError);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// PUT /profile/
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    let { bio, hobbies, socialLinks, customHtml, theme, profilePicture } = req.body;

    console.log('Profile update request received');
    console.log('userId from token:', userId, '(type:', typeof userId, ')');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    if (!userId) {
      console.log('No userId found in request');
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Ensure proper data types for Prisma
    // Make sure bio, customHtml, and theme are strings
    bio = bio || '';
    customHtml = customHtml || '';
    theme = theme || 'default';
    profilePicture = profilePicture || null;

    // Convert hobbies to string if it's an array
    if (Array.isArray(hobbies)) {
      hobbies = hobbies.join(', ');
    } else if (hobbies === null || hobbies === undefined) {
      hobbies = '';
    }

    // Ensure socialLinks is valid JSON or null
    if (socialLinks === undefined) {
      socialLinks = null;
    }

    console.log('Processed data for database:');
    console.log('- userId:', parseInt(userId), '(type:', typeof parseInt(userId), ')');
    console.log('- bio:', bio, '(type:', typeof bio, ')');
    console.log('- hobbies:', hobbies, '(type:', typeof hobbies, ')');
    console.log('- socialLinks:', JSON.stringify(socialLinks), '(type:', typeof socialLinks, ')');
    console.log('- customHtml:', customHtml ? 'present' : 'empty', '(type:', typeof customHtml, ')');
    console.log('- theme:', theme, '(type:', typeof theme, ')');
    console.log('- profilePicture:', profilePicture ? 'present' : 'empty', '(type:', typeof profilePicture, ')');

    // Try to get the user first to make sure they exist
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!userExists) {
      console.log('User not found with ID:', userId);
      res.status(404).json({ error: 'User not found' });
      return;
    }

    try {
      // Try with all fields first
      const profile = await prisma.profile.upsert({
        where: { userId: parseInt(userId) },
        update: {
          bio,
          hobbies,
          socialLinks,
          customHtml,
          theme,
          profilePicture,
        },
        create: {
          userId: parseInt(userId),
          bio,
          hobbies,
          socialLinks,
          customHtml,
          theme,
          profilePicture,
          likesCount: 0,
        },
      });
      
      console.log('Profile updated successfully');
      res.json({
        ...profile,
        username: userExists.username
      });
    } catch (error) {
      console.log('Database error during profile update:', error);
      
      // Check if error is due to missing columns
      if (error.code === 'P2022') {
        // Column doesn't exist in database - try without the problematic fields
        try {
          const profile = await prisma.profile.upsert({
            where: { userId: parseInt(userId) },
            update: {
              bio,
              hobbies,
              socialLinks,
              customHtml,
              theme,
              // Omit profilePicture and likesCount
            },
            create: {
              userId: parseInt(userId),
              bio,
              hobbies,
              socialLinks,
              customHtml,
              theme,
              // Omit profilePicture and likesCount
            },
          });
          
          console.log('Profile updated successfully (without new columns)');
          res.json({
            ...profile,
            username: userExists.username,
            profilePicture: null,
            likesCount: 0,
          });
        } catch (fallbackError) {
          console.error('Error in profile update fallback:', fallbackError);
          res.status(500).json({ error: 'Failed to update profile', details: null });
        }
      } else {
        res.status(500).json({ error: 'Failed to update profile', details: null });
      }
    }
  } catch (err) {
    console.error('Error in updateProfile:', err);
    res.status(500).json({ error: 'Failed to update profile', details: null });
  }
};

// Export all controller functions
module.exports = {
  getProfile,
  updateProfile,
}; 
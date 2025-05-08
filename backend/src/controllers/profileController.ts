import { Request, Response, RequestHandler, NextFunction } from 'express';
import prisma from '../prismaClient';

// Interface for the authenticated request with userId
interface AuthRequest extends Request {
  userId?: string;
}

// GET /profile/:username
export const getProfile: RequestHandler = async (req, res, next) => {
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

    res.json(user.profile);
  } catch (err) {
    console.error('Error in getProfile:', err);
    next(err);
  }
};

// PUT /profile/
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    let { bio, hobbies, socialLinks, customHtml, theme } = req.body;

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

    // Try to get the user first to make sure they exist
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!userExists) {
      console.log(`User not found with ID: ${userId}`);
      res.status(404).json({ error: 'User not found' });
      return;
    }

    try {
      const profile = await prisma.profile.upsert({
        where: { userId: parseInt(userId) },
        update: { 
          bio, 
          hobbies, 
          socialLinks, 
          customHtml, 
          theme 
        },
        create: {
          userId: parseInt(userId),
          bio,
          hobbies,
          socialLinks,
          customHtml,
          theme,
        },
      });

      console.log('Profile updated successfully:', profile.id);
      res.json(profile);
    } catch (dbError: any) {
      console.error('Database error during profile update:', dbError);
      res.status(500).json({ 
        error: 'Failed to update profile',
        details: process.env.NODE_ENV === 'development' ? dbError.message : null 
      });
    }
  } catch (err) {
    console.error('Unexpected error in updateProfile:', err);
    next(err);
  }
};

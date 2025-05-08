import { Request, Response, RequestHandler } from 'express';
import prisma from '../prismaClient';

// GET /profile/:username
export const getProfile: RequestHandler = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!user) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    res.json(user.profile);
  } catch (err) {
    next(err);
  }
};

// PUT /profile/
export const updateProfile: RequestHandler = async (req, res, next) => {
  const userId = req.userId;
  const { bio, hobbies, socialLinks, customHtml, theme } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const profile = await prisma.profile.upsert({
      where: { userId: parseInt(userId) },
      update: { bio, hobbies, socialLinks, customHtml, theme },
      create: {
        userId: parseInt(userId),
        bio,
        hobbies,
        socialLinks,
        customHtml,
        theme,
      },
    });

    res.json(profile);
  } catch (err) {
    next(err);
  }
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /profile/:username
export const getProfile = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.json(user.profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// PUT /profile/
export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.userId;  // assuming `userId` is set by your auth middleware
  const { bio, hobbies, socialLinks, customHtml, theme } = req.body;

  try {
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { bio, hobbies, socialLinks, customHtml, theme },
      create: {
        userId,
        bio,
        hobbies,
        socialLinks,
        customHtml,
        theme,
      },
    });

    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

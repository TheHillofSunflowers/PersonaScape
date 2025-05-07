import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });
    if (!user) return res.status(404).json({ error: 'Profile not found' });
    res.json(user.profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.userId;
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
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

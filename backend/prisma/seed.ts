import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a few users
  const users = [
    {
      username: 'john_doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10)
    },
    {
      username: 'jane_smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('password456', 10)
    },
    {
      username: 'bob_jackson',
      email: 'bob@example.com',
      password: await bcrypt.hash('password789', 10)
    }
  ];

  // Insert users and create profiles for each
  for (const userData of users) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Create user
      const user = await prisma.user.create({
        data: userData
      });
      console.log(`Created user ${user.username} with ID ${user.id}`);

      // Create a profile for the user
      const profile = await prisma.profile.create({
        data: {
          userId: user.id,
          bio: `This is ${user.username}'s bio.`,
          hobbies: 'Reading, traveling, coding',
          socialLinks: {
            twitter: `https://twitter.com/${user.username}`,
            linkedin: `https://linkedin.com/in/${user.username}`
          },
          theme: 'default',
          likesCount: 0
        }
      });

      console.log(`Created profile for user ${user.username}`);
    } catch (error) {
      console.error('Error creating user and profile:', error);
    }
  }
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

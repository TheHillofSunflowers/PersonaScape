// Add likes between users
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding likes...');
    
    // Get all users
    const users = await prisma.user.findMany();
    
    if (users.length < 2) {
      console.log('Not enough users to create likes. Skipping seed.');
      return;
    }
    
    console.log(`Found ${users.length} users`);
    
    // Get all profiles
    const profiles = await prisma.profile.findMany();
    
    if (profiles.length === 0) {
      console.log('No profiles found. Skipping seed.');
      return;
    }
    
    console.log(`Found ${profiles.length} profiles`);
    
    // Create some random likes between users
    const likesToCreate = [];
    
    for (const user of users) {
      // Each user likes 1-3 profiles (that aren't their own)
      const otherProfiles = profiles.filter(profile => profile.userId !== user.id);
      
      if (otherProfiles.length === 0) continue;
      
      // Randomly pick 1-3 profiles to like
      const numLikes = Math.min(Math.floor(Math.random() * 3) + 1, otherProfiles.length);
      
      // Shuffle profiles and take the first numLikes
      const shuffled = [...otherProfiles].sort(() => 0.5 - Math.random());
      const profilesToLike = shuffled.slice(0, numLikes);
      
      for (const profile of profilesToLike) {
        likesToCreate.push({
          userId: user.id,
          profileId: profile.id
        });
      }
    }
    
    console.log(`Creating ${likesToCreate.length} likes...`);
    
    // Delete existing likes first
    await prisma.profileLike.deleteMany({});
    
    // Reset likes counts
    await prisma.profile.updateMany({
      data: {
        likesCount: 0
      }
    });
    
    // Insert likes and update counts
    for (const like of likesToCreate) {
      // Create the like
      await prisma.profileLike.create({
        data: like
      });
      
      // Increment the likes count
      await prisma.profile.update({
        where: { id: like.profileId },
        data: {
          likesCount: {
            increment: 1
          }
        }
      });
    }
    
    console.log('Seeding likes completed successfully!');
  } catch (error) {
    console.error('Error seeding likes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
// Debug version of profileController
// Run this to test what's happening in isolation from Express

// Replace these with your actual dependencies
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sample user ID for testing
const userId = 1; // Replace with an actual user ID from your database

// Sample profile data (same format as frontend would send)
const profileData = {
  bio: 'Test bio from debug controller',
  hobbies: 'Reading, Coding, Gaming',
  socialLinks: [
    { platform: 'Twitter', url: 'https://twitter.com/test' },
    { platform: 'GitHub', url: 'https://github.com/test' }
  ],
  theme: 'default',
  customHtml: '<p>Hello from debug test</p>'
};

// Debug version of the updateProfile controller
async function debugUpdateProfile() {
  console.log('=== Debug Profile Controller ===');
  console.log('Input data:', JSON.stringify(profileData, null, 2));
  console.log('userId:', userId, '(type:', typeof userId, ')');
  
  try {
    // First check if the user exists
    console.log('Checking if user exists...');
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      console.error('User not found with ID:', userId);
      return;
    }
    console.log('User found:', user.username);
    
    // Extract data from request body
    const { bio, hobbies, socialLinks, customHtml, theme } = profileData;
    
    console.log('Parsed data:');
    console.log('- bio:', bio, '(type:', typeof bio, ')');
    console.log('- hobbies:', hobbies, '(type:', typeof hobbies, ')');
    console.log('- socialLinks:', JSON.stringify(socialLinks), '(type:', typeof socialLinks, ')');
    console.log('- customHtml:', customHtml, '(type:', typeof customHtml, ')');
    console.log('- theme:', theme, '(type:', typeof theme, ')');
    
    // Try the upsert operation
    console.log('Attempting profile upsert...');
    const profile = await prisma.profile.upsert({
      where: { userId: userId },
      update: { bio, hobbies, socialLinks, customHtml, theme },
      create: {
        userId: userId,
        bio,
        hobbies,
        socialLinks,
        customHtml,
        theme,
      },
    });
    
    console.log('Profile updated successfully:');
    console.log(JSON.stringify(profile, null, 2));
  } catch (err) {
    console.error('Error in profile update:', err);
    console.error('Error details:');
    console.error('- Name:', err.name);
    console.error('- Message:', err.message);
    console.error('- Code:', err.code);
    
    // For Prisma errors, check additional details
    if (err.code === 'P2002') {
      console.error('Unique constraint violation');
    } else if (err.code === 'P2025') {
      console.error('Record not found');
    }
    
    // Log full error for deeper analysis
    console.error('Full error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the debug function
debugUpdateProfile()
  .then(() => console.log('Debug test completed'))
  .catch(err => console.error('Unexpected error:', err)); 
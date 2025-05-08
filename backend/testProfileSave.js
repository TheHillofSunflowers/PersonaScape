// Diagnostic script for profile save functionality
const axios = require('axios');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Sample profile data matching the expected schema
const profileData = {
  bio: 'Test bio',
  hobbies: 'Reading, Coding, Gaming',
  socialLinks: [
    { platform: 'Twitter', url: 'https://twitter.com/test' },
    { platform: 'GitHub', url: 'https://github.com/test' }
  ],
  theme: 'default',
  customHtml: '<p>Hello world</p>'
};

// Test with token from localStorage
async function testWithToken(token, data = profileData) {
  console.log('\n--- Testing profile update with token ---');
  try {
    console.log('Request data:', JSON.stringify(data, null, 2));
    
    const response = await axios.put('http://localhost:5000/profile/', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('SUCCESS! Profile updated.');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('ERROR: Profile update failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('Data:', error.response.data);
      
      if (error.response.status === 500) {
        console.error('This is a server error. Check the backend logs for details.');
      } else if (error.response.status === 401) {
        console.error('Authentication failed. The token might be invalid or expired.');
        
        // Try to decode the token
        console.log('\nToken information:');
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            
            console.log('Token header:', header);
            console.log('Token payload:', payload);
            
            if (payload.exp) {
              const expDate = new Date(payload.exp * 1000);
              const now = new Date();
              console.log('Token expiration:', expDate.toISOString());
              console.log('Current time:', now.toISOString());
              console.log('Token expired:', expDate < now ? 'YES' : 'NO');
            }
            
            if (payload.userId) {
              console.log('UserId in token:', payload.userId);
              console.log('UserId type:', typeof payload.userId);
            }
          }
        } catch (e) {
          console.error('Failed to decode token:', e.message);
        }
      }
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Main function
async function main() {
  console.log('=== Profile Update Diagnostic Tool ===');

  rl.question('Enter your JWT token from localStorage: ', async (token) => {
    await testWithToken(token);
    
    rl.question('Try with modified data? (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        // Try with slightly different data format
        const modifiedData = {
          ...profileData,
          // Convert hobbies to array to see if that works
          hobbies: profileData.hobbies.split(',').map(h => h.trim()),
          // Convert socialLinks to object format
          socialLinks: profileData.socialLinks.reduce((obj, link) => {
            obj[link.platform] = link.url;
            return obj;
          }, {})
        };
        
        console.log('\n--- Testing with modified data format ---');
        console.log('Modified data:', JSON.stringify(modifiedData, null, 2));
        
        rl.question('Press Enter to continue with test...', async () => {
          await testWithToken(token, modifiedData);
          rl.close();
        });
      } else {
        rl.close();
      }
    });
  });
}

main(); 
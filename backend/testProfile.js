// Test script to debug profile creation and update
const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Sample JWT token - replace with your actual token after login
let token = '';

// Sample profile data matching the schema
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

// Function to login and get token
async function login(username, password) {
  try {
    console.log('Attempting to login...');
    const response = await axios.post('http://localhost:5000/auth/login', {
      username,
      password
    });
    
    token = response.data.token;
    console.log('Login successful, token received');
    return true;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return false;
  }
}

// Function to update profile
async function updateProfile() {
  try {
    console.log('Attempting to update profile with data:', JSON.stringify(profileData, null, 2));
    
    const response = await axios.put('http://localhost:5000/profile/', profileData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Profile update successful');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('Profile update failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      // Additional debug info for server errors
      if (error.response.status >= 500) {
        console.error('This is a server-side error. Check the backend logs for more details.');
      }
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Function to get profile
async function getProfile(username) {
  try {
    console.log(`Attempting to get profile for ${username}...`);
    
    const response = await axios.get(`http://localhost:5000/profile/${username}`);
    
    console.log('Profile fetch successful');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Profile fetch failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
}

// Main function to run the tests
async function runTests() {
  rl.question('Enter username: ', async (username) => {
    rl.question('Enter password: ', async (password) => {
      // Login to get token
      const loginSuccess = await login(username, password);
      
      if (loginSuccess) {
        // Try to get profile first
        await getProfile(username);
        
        // Then update profile
        await updateProfile();
        
        // Get profile again to verify update
        await getProfile(username);
      }
      
      rl.close();
    });
  });
}

runTests(); 
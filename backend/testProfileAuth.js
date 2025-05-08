/**
 * Test script for profile API with authentication
 * Run with: node testProfileAuth.js
 */

const http = require('http');
const jwt = require('jsonwebtoken');

// Replace with your actual token
const TOKEN = process.env.TEST_TOKEN || "YOUR_JWT_TOKEN"; // Replace or set TEST_TOKEN env var

console.log('Testing profile API with authentication...');

// Decode token without verifying signature
try {
  const decoded = jwt.decode(TOKEN);
  console.log('Decoded token (not verified):', decoded);
  console.log('User ID from token:', decoded?.userId);
  console.log('Token expiry:', new Date(decoded?.exp * 1000).toISOString());
  
  if (decoded?.exp * 1000 < Date.now()) {
    console.warn('❌ WARNING: Token is expired!');
  }
} catch (err) {
  console.error('Failed to decode token:', err.message);
}

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`Response status: ${res.statusCode} ${res.statusMessage}`);
        console.log('Headers:', JSON.stringify(res.headers, null, 2));
        
        try {
          // Try to parse as JSON
          const jsonData = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, headers: res.headers, data: jsonData });
        } catch (e) {
          // Return raw data if not JSON
          resolve({ statusCode: res.statusCode, headers: res.headers, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      const jsonData = JSON.stringify(data);
      req.write(jsonData);
    }
    
    req.end();
  });
}

// Test the OPTIONS request for the profile endpoint
async function testOptionsRequest() {
  console.log('\n📋 Testing OPTIONS request to /api/profile/...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/profile/',
    method: 'OPTIONS',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000'
    }
  };
  
  try {
    const response = await makeRequest(options);
    
    if (response.statusCode === 204) {
      console.log('✅ OPTIONS request successful!');
      console.log('CORS headers:');
      console.log('- Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
      console.log('- Access-Control-Allow-Methods:', response.headers['access-control-allow-methods']);
      console.log('- Access-Control-Allow-Headers:', response.headers['access-control-allow-headers']);
    } else {
      console.log('❌ OPTIONS request failed with status:', response.statusCode);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error making OPTIONS request:', error.message);
    throw error;
  }
}

// Test the PUT request to update profile with authentication
async function testProfileUpdateRequest() {
  console.log('\n📋 Testing PUT request to /api/profile/...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/profile/',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000',
      'Authorization': `Bearer ${TOKEN}`
    }
  };
  
  const testProfile = {
    bio: 'Test bio',
    hobbies: 'Reading, Coding',
    theme: 'default',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/testuser' }
    ]
  };
  
  try {
    const response = await makeRequest(options, testProfile);
    
    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('✅ Profile update request successful!');
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('❌ Profile update request failed with status:', response.statusCode);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error making profile update request:', error.message);
    throw error;
  }
}

// Run the tests
async function runTests() {
  try {
    await testOptionsRequest();
    await testProfileUpdateRequest();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
  }
}

runTests(); 
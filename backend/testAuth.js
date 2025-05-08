/**
 * Test script for auth endpoints
 * Run with: node testAuth.js
 */

const http = require('http');

console.log('Testing auth endpoints...');

// Test user data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

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

// Test the OPTIONS request for the login endpoint
async function testOptionsRequest() {
  console.log('\n📋 Testing OPTIONS request to /api/auth/login...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
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

// Test the login endpoint
async function testLoginRequest() {
  console.log('\n📋 Testing POST request to /api/auth/login...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000'
    }
  };
  
  try {
    const response = await makeRequest(options, testUser);
    
    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('✅ Login request successful!');
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('❌ Login request failed with status:', response.statusCode);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error making login request:', error.message);
    throw error;
  }
}

// Run the tests
async function runTests() {
  try {
    await testOptionsRequest();
    await testLoginRequest();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
  }
}

runTests(); 
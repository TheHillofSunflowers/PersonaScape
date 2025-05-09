// Test CORS configuration for the backend server
const axios = require('axios');

// Base URLs to test
const baseUrls = [
  process.env.NEXT_PUBLIC_API_BASE_URL,
  'http://127.0.0.1:5000'
];

// Common API endpoints to test
const endpoints = [
  '/api/test-cors',  // Dedicated test endpoint
  '/api/network-info', // Network diagnostics
  '/profile/testuser' // Profile endpoint (using a test username)
];

// Headers to test with
const testHeaders = {
  standard: {
    'Content-Type': 'application/json'
  },
  withAuth: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test-token'
  },
  withCustomOrigin: {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:3000'
  }
};

// Main test function
async function runCorsTests() {
  console.log('🔍 Starting CORS configuration tests...\n');
  
  // Test each base URL
  for (const baseUrl of baseUrls) {
    console.log(`\n📡 Testing base URL: ${baseUrl}`);
    
    // Test each endpoint
    for (const endpoint of endpoints) {
      const url = `${baseUrl}${endpoint}`;
      console.log(`\n🌐 Testing endpoint: ${url}`);
      
      // 1. GET request with standard headers
      await testRequest('GET', url, null, testHeaders.standard, 'Standard Headers');
      
      // 2. OPTIONS preflight request
      await testPreflight(url);
      
      // 3. GET with custom origin header
      await testRequest('GET', url, null, testHeaders.withCustomOrigin, 'Custom Origin Header');
    }
  }
  
  // Test PUT request to profile endpoint
  const profileUrl = `${baseUrls[0]}/profile/`;
  console.log(`\n🔒 Testing PUT request to: ${profileUrl}`);
  const testData = { test: 'data' };
  await testRequest('PUT', profileUrl, testData, testHeaders.withAuth, 'PUT with Auth');
  
  console.log('\n✅ CORS testing completed');
}

// Helper function to make a generic request and log results
async function testRequest(method, url, data = null, headers = {}, label = '') {
  console.log(`\n▶️ Testing ${method} request to ${url} ${label ? `(${label})` : ''}`);
  
  try {
    const config = {
      method,
      url,
      headers,
      timeout: 5000, // 5 second timeout
      validateStatus: () => true, // Don't throw error on any status code
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    
    console.log(`⭐ Status: ${response.status} ${response.statusText || ''}`);
    console.log('⭐ Response headers:');
    
    // Log critical CORS headers
    const corsHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers',
      'access-control-allow-credentials',
      'access-control-max-age'
    ];
    
    corsHeaders.forEach(header => {
      if (response.headers[header]) {
        console.log(`   ${header}: ${response.headers[header]}`);
      } else {
        console.log(`   ${header}: MISSING`);
      }
    });
    
    // Log other headers
    Object.keys(response.headers)
      .filter(h => !corsHeaders.includes(h))
      .forEach(h => console.log(`   ${h}: ${response.headers[h]}`));
    
    // Log brief response data
    if (response.data) {
      const dataStr = typeof response.data === 'object' 
        ? JSON.stringify(response.data).substring(0, 200) 
        : response.data.toString().substring(0, 200);
      console.log(`⭐ Response data: ${dataStr}${dataStr.length >= 200 ? '...' : ''}`);
    }
    
    return response.status;
  } catch (error) {
    console.error(`❌ Error testing ${method} ${url}:`);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data)}`);
      console.error(`   Headers: ${JSON.stringify(error.response.headers)}`);
    } else if (error.request) {
      console.error('   No response received');
      console.error(`   Request: ${error.request}`);
    } else {
      console.error(`   Error message: ${error.message}`);
    }
    
    return null;
  }
}

// Helper function to test OPTIONS preflight request
async function testPreflight(url) {
  console.log(`\n▶️ Testing OPTIONS preflight request to ${url}`);
  
  try {
    const response = await axios({
      method: 'OPTIONS',
      url,
      headers: {
        'Access-Control-Request-Method': 'PUT',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
        'Origin': 'http://localhost:3000'
      },
      timeout: 5000,
      validateStatus: () => true
    });
    
    console.log(`⭐ Preflight Status: ${response.status} ${response.statusText || ''}`);
    console.log('⭐ Preflight response headers:');
    
    // Log critical CORS headers
    const corsHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers',
      'access-control-allow-credentials',
      'access-control-max-age'
    ];
    
    corsHeaders.forEach(header => {
      if (response.headers[header]) {
        console.log(`   ${header}: ${response.headers[header]}`);
      } else {
        console.log(`   ${header}: MISSING`);
      }
    });
    
    // Check if preflight was successful
    if (response.status === 204 || response.status === 200) {
      console.log('✅ Preflight successful');
    } else {
      console.log('⚠️ Preflight failed or incomplete');
    }
    
    return response.status;
  } catch (error) {
    console.error('❌ Error testing OPTIONS preflight:');
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data)}`);
      console.error(`   Headers: ${JSON.stringify(error.response.headers)}`);
    } else if (error.request) {
      console.error('   No response received');
    } else {
      console.error(`   Error message: ${error.message}`);
    }
    
    return null;
  }
}

// Run the tests
runCorsTests().catch(error => {
  console.error('❌ Fatal error running tests:', error);
}); 
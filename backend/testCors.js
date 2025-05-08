// Script to test if CORS is working
const http = require('http');

const serverUrl = 'http://localhost:5000/api/test-cors';
console.log(`Testing CORS at ${serverUrl}...`);

// Try a CORS request with custom headers to simulate browser behavior
const options = {
  method: 'GET',
  headers: {
    'Origin': 'http://localhost:3000',
    'Access-Control-Request-Method': 'GET',
    'Access-Control-Request-Headers': 'Content-Type, Authorization'
  }
};

// Make the request
http.get(serverUrl, options, (res) => {
  console.log(`Server responded with status code: ${res.statusCode}`);
  console.log('Response headers:', res.headers);
  
  // Check for CORS headers
  const corsHeaders = [
    'access-control-allow-origin',
    'access-control-allow-methods',
    'access-control-allow-headers'
  ];
  
  let hasAllCorsHeaders = true;
  corsHeaders.forEach(header => {
    if (!res.headers[header]) {
      console.log(`❌ Missing CORS header: ${header}`);
      hasAllCorsHeaders = false;
    } else {
      console.log(`✅ Found CORS header: ${header} = ${res.headers[header]}`);
    }
  });
  
  if (hasAllCorsHeaders) {
    console.log('CORS is properly configured! ✅');
  } else {
    console.log('CORS configuration is incomplete ❌');
  }
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Response data:', response);
    } catch (e) {
      console.log('Response body (not JSON):', data);
    }
  });
}).on('error', (err) => {
  console.error('Error testing CORS: ❌', err.message);
}); 
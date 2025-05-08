/**
 * Simple test script to verify the backend server is running correctly
 * Run with: node testBasic.js
 */

const http = require('http');

console.log('Testing backend server connection...');

// Try to connect to the backend server
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/test-cors',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse body:');
    try {
      const parsedData = JSON.parse(data);
      console.log(JSON.stringify(parsedData, null, 2));
      
      console.log('\n✅ Server is running correctly and responding to requests!');
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Server connection error:', error.message);
  console.log('\nPossible issues:');
  console.log('- Backend server is not running');
  console.log('- Server is running on a different port (default is 5000)');
  console.log('- There\'s a network issue preventing connection');
  console.log('\nMake sure to run "npm start" in the backend directory first.');
});

req.end();

console.log('Request sent, waiting for response...\n'); 
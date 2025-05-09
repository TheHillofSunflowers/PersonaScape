// Simple script to test if the server is running and accessible
const http = require('http');

const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log(`Testing server connection to ${serverUrl}...`);

// Try a simple GET request to check if the server is up
http.get(serverUrl, (res) => {
  console.log(`Server responded with status code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
    console.log('Server is accessible! ✅');
  });
}).on('error', (err) => {
  console.error('Error connecting to server: ❌', err.message);
  console.log('Please make sure your server is running on port 5000');
}); 
/**
 * Utility to generate a valid JWT token for testing
 * Run with: node generateTestToken.js <userId>
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
let JWT_SECRET = 'super-secret-jwt-token-for-development'; // Default fallback

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const secretMatch = envContent.match(/JWT_SECRET=["']?([^"'\n]+)["']?/);
  
  if (secretMatch && secretMatch[1]) {
    JWT_SECRET = secretMatch[1];
    console.log('Using JWT_SECRET from .env file');
  } else {
    console.log('JWT_SECRET not found in .env file, using default');
  }
} else {
  console.log('No .env file found, using default JWT_SECRET');
}

// Get user ID from command line argument or use default
const userId = process.argv[2] || '1';

// Generate token
const token = jwt.sign(
  { userId: userId },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Decode the token to show its contents
const decoded = jwt.decode(token);

console.log('\n======== TEST TOKEN ========');
console.log(token);
console.log('\n======== DECODED TOKEN ========');
console.log(decoded);
console.log('\nTo use this token, run:');
console.log(`TEST_TOKEN="${token}" node testProfileAuth.js`);
console.log('\nOr update your localStorage in the browser console with:');
console.log(`localStorage.setItem('token', '${token}')`);
console.log('\nToken will expire on:', new Date(decoded.exp * 1000).toISOString()); 
// This script will explicitly generate Prisma client

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Prisma initialization...');

// Check if schema.prisma exists
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error('Error: schema.prisma not found at', schemaPath);
  process.exit(1);
}

// Check if environment file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('Warning: .env file not found. Creating default .env file...');
  const defaultEnv = `DATABASE_URL="postgresql://postgres:password@localhost:5432/personascape?schema=public"
JWT_SECRET="super-secret-jwt-token-for-development"
PORT=5000
FRONTEND_URL="http://localhost:3000"`;

  fs.writeFileSync(envPath, defaultEnv);
  console.log('Default .env file created');
}

// Run Prisma generate with detailed output capture
console.log('Running prisma generate...');
const generate = spawnSync('npx', ['prisma', 'generate'], {
  stdio: 'pipe',
  encoding: 'utf-8',
  shell: true
});

if (generate.status !== 0) {
  console.error('Error generating Prisma client:');
  console.error('EXIT CODE:', generate.status);
  console.error('STDOUT:', generate.stdout);
  console.error('STDERR:', generate.stderr);
  process.exit(1);
} else {
  console.log('Prisma client generated successfully');
  console.log(generate.stdout);
}

// Try to require the generated client to verify it works
try {
  console.log('Testing Prisma client...');
  // This forces a fresh require without using the cache
  delete require.cache[require.resolve('@prisma/client')];
  require('@prisma/client');
  console.log('Prisma client loaded successfully');
} catch (error) {
  console.error('Error loading Prisma client:', error);
  process.exit(1);
}

console.log('Prisma initialization complete'); 
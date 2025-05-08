// This script resets the database
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting database reset...');

// Check if .env file exists and create it if it doesn't
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('Warning: .env file not found. Creating default .env file...');
  const defaultEnv = `DATABASE_URL="postgresql://postgres:password@localhost:5432/personascape?schema=public"
JWT_SECRET="super-secret-jwt-token-for-development"
PORT=5000
FRONTEND_URL="http://localhost:3000"`;

  fs.writeFileSync(envPath, defaultEnv);
  console.log('Default .env file created');
}

// Run db push to create/update schema
console.log('Pushing schema to database...');
const push = spawnSync('npx', ['prisma', 'db', 'push'], {
  stdio: 'pipe',
  encoding: 'utf-8',
  shell: true
});

if (push.status !== 0) {
  console.error('Error pushing schema to database:');
  console.error('EXIT CODE:', push.status);
  console.error('STDOUT:', push.stdout);
  console.error('STDERR:', push.stderr);
  process.exit(1);
} else {
  console.log('Schema pushed successfully');
  console.log(push.stdout);
}

// Generate Prisma client
console.log('Generating Prisma client...');
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

console.log('Database reset complete'); 
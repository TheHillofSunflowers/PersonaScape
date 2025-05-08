// Simple test script to verify Prisma client access

console.log('Testing Prisma client access...');

try {
  // Try to require Prisma client directly from generated path
  const { PrismaClient } = require('./generated/prisma');
  console.log('✅ Successfully imported PrismaClient from generated path');
  
  // Create an instance
  const prisma = new PrismaClient();
  console.log('✅ Successfully created PrismaClient instance');
  
  // Try to connect
  console.log('Attempting to connect to database...');
  prisma.$connect()
    .then(() => {
      console.log('✅ Successfully connected to database');
      console.log('Testing complete - everything is working! 🎉');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error connecting to database:', err);
      process.exit(1);
    });
} catch (err) {
  console.error('❌ Error requiring Prisma client:', err);
  process.exit(1);
} 
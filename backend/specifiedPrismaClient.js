/**
 * This file ensures that a single Prisma client instance is used throughout the app
 * It handles CommonJS compatibility and explicit path resolution
 */

// Try different import approaches in order of preference
let PrismaClient;
try {
  // Approach 1: Try direct import from generated path
  PrismaClient = require('./generated/prisma').PrismaClient;
  console.log('Using Prisma client from generated path');
} catch (err) {
  try {
    // Approach 2: Try standard @prisma/client import
    PrismaClient = require('@prisma/client').PrismaClient;
    console.log('Using Prisma client from node_modules');
  } catch (err2) {
    // Handle failure
    console.error('Failed to import PrismaClient', err2);
    throw new Error('Could not import PrismaClient');
  }
}

// Create a singleton instance
let prismaInstance = null;

function getPrismaClient() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
    console.log('Created new PrismaClient instance');
  }
  return prismaInstance;
}

// Get or create the client
const prisma = getPrismaClient();

// Export for CommonJS only
module.exports = prisma; 
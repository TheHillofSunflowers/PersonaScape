// Import the PrismaClient class from the Prisma package
const { PrismaClient } = require('@prisma/client');

// Create a single instance of the Prisma client
const prisma = new PrismaClient();

// Export the prisma client for use throughout the application
module.exports = prisma; 
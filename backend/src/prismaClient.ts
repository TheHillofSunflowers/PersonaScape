// Import directly from the actual @prisma/client package
import { PrismaClient } from '@prisma/client';

// Create a simple client instance
const prisma = new PrismaClient();

// Export in a way that's compatible with TypeScript using CommonJS
export default prisma;
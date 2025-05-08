import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Check if .env file exists
const envPath = path.resolve(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('No .env file found, creating one with default values...');
  
  const defaultEnv = `DATABASE_URL="postgresql://postgres:password@localhost:5432/personascape?schema=public"
JWT_SECRET="super-secret-jwt-token-for-development"
PORT=5000
FRONTEND_URL="http://localhost:3000"`;

  fs.writeFileSync(envPath, defaultEnv);
  console.log('.env file created with default values');
}

// Load environment variables
dotenv.config();

// Check required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

console.log('Environment variables loaded successfully'); 
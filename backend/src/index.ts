// Load environment check first
import './checkEnv';

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';

// Import Prisma client
import prisma from './prismaClient';

// Initialize Prisma client
async function initPrisma() {
  try {
    console.log('Attempting to connect to the database...');
    await prisma.$connect();
    console.log('Prisma client connected to database successfully');
    
    // Test query to ensure connection works
    const userCount = await prisma.user.count();
    console.log(`Database has ${userCount} users`);
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    process.exit(1);
  }
}

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware first
app.use(cors(corsOptions));

// Then apply other middleware
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Profile Builder API is running 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/profile', profileRoutes);

// Error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Start the server after initializing Prisma
initPrisma().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

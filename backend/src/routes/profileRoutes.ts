import { Router, RequestHandler } from 'express';
import cors from 'cors';
import { getProfile, updateProfile } from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// More permissive CORS configuration for profile routes
const corsOptions = {
  origin: '*', // Allow all origins in development
  credentials: true, // Enable credentials for auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // Cache preflight request for 24 hours
};

// Apply CORS specifically to profile routes
router.use(cors(corsOptions));

// Handle OPTIONS requests explicitly
router.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

router.get('/:username', getProfile as RequestHandler);
router.put('/', authenticateToken as RequestHandler, updateProfile as RequestHandler);

export default router;

import { Router, RequestHandler } from 'express';
import cors from 'cors';
import { getProfile, updateProfile } from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// More permissive CORS configuration for profile routes
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Match the origins in the main app
  credentials: true, // Enable credentials for auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Pragma'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // Cache preflight request for 24 hours
};

// Apply CORS specifically to profile routes
router.use(cors(corsOptions));

// Handle OPTIONS requests explicitly
router.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // Add the CORS headers manually to ensure they're applied
    res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma');
    
    res.status(204).end();
    return;
  }
  next();
});

router.get('/:username', getProfile as RequestHandler);
router.put('/', authenticateToken as RequestHandler, updateProfile as RequestHandler);

export default router;

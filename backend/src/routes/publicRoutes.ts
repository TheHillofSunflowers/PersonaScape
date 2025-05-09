import { Router, RequestHandler } from 'express';
import { getLeaderboard } from '../controllers/likesController';

const router = Router();

// Public leaderboard - no authentication required
router.get('/leaderboard', getLeaderboard as RequestHandler);

export default router; 
import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { 
  likeProfile, 
  unlikeProfile, 
  checkLikeStatus, 
  getLikedProfiles, 
  getLeaderboard 
} from '../controllers/likesController';

const router = Router();

// All routes require authentication
router.use(authenticateToken as RequestHandler);

// Like/unlike a profile
router.post('/profile/:profileId', likeProfile as RequestHandler);
router.delete('/profile/:profileId', unlikeProfile as RequestHandler);

// Check if user has liked a profile
router.get('/check/:profileId', checkLikeStatus as RequestHandler);

// Get profiles liked by the user
router.get('/user', getLikedProfiles as RequestHandler);

// Get most liked profiles (leaderboard)
router.get('/leaderboard', getLeaderboard as RequestHandler);

export default router; 
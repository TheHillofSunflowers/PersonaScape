import { Router, RequestHandler } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/:username', getProfile as RequestHandler);
router.put('/', authenticateToken as RequestHandler, updateProfile as RequestHandler);

export default router;

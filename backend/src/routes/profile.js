import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:username', getProfile);
router.put('/', authenticate, updateProfile);

export default router;

const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { 
  likeProfile, 
  unlikeProfile, 
  checkLikeStatus, 
  getLikedProfiles, 
  getLeaderboard 
} = require('../controllers/likesController');

const router = express.Router();

// Configure routes - public and authenticated endpoints
// Public route - doesn't need authentication
router.get('/leaderboard', getLeaderboard);

// Routes that require authentication
router.use(authenticateToken);

// Like/unlike a profile
router.post('/profile/:profileId', likeProfile);
router.delete('/profile/:profileId', unlikeProfile);

// Check if user has liked a profile
router.get('/check/:profileId', checkLikeStatus);

// Get profiles liked by the user
router.get('/user', getLikedProfiles);

module.exports = router; 
const { Router } = require('express');
const { getLeaderboard } = require('../controllers/likesController');

const router = Router();

// Public leaderboard - no authentication required
router.get('/leaderboard', getLeaderboard);

module.exports = router; 
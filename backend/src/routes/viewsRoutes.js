const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');
const { verifyTokenOptional } = require('../middleware/authMiddleware');

// POST /api/views/profile/:username - Record a profile view
// Uses optional auth - will identify the viewer if they're logged in
router.post('/profile/:username', verifyTokenOptional, viewsController.recordProfileView);

// GET /api/views/profile/:username/stats - Get view statistics for a profile
// Uses optional auth - profile owner gets more detailed stats
router.get('/profile/:username/stats', verifyTokenOptional, viewsController.getProfileViewStats);

// GET /api/views/leaderboard - Get the most viewed profiles
router.get('/leaderboard', viewsController.getViewsLeaderboard);

module.exports = router; 
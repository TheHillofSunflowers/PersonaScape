const { Router } = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = Router();

// Profile routes
router.get("/:username", getProfile);
router.put("/", authenticateToken, updateProfile);

module.exports = router; 
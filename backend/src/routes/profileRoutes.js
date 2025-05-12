const { Router } = require('express');
const { getProfile, updateProfile, uploadBackgroundImage } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = Router();

// Profile routes
router.get("/:username", getProfile);
router.put("/", authenticateToken, updateProfile);
router.post("/upload-background", authenticateToken, upload.single('backgroundImage'), uploadBackgroundImage);

module.exports = router; 
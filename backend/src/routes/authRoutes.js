const { Router } = require("express");
const { signup, login, getMe } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);

module.exports = router; 
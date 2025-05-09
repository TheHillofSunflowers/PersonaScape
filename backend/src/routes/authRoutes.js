const { Router } = require("express");
const cors = require("cors");
const { signup, login, getMe } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = Router();

// More permissive CORS configuration for auth routes
const corsOptions = {
  origin: '*', // Allow all origins in development
  credentials: true, // Enable credentials for auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // Cache preflight request for 24 hours
};

// Apply CORS specifically to auth routes
router.use(cors(corsOptions));

// Handle OPTIONS requests explicitly
router.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);

module.exports = router; 
const { authenticateToken } = require('./authMiddleware');

// Create a wrapper around authenticateToken that sets req.user instead of req.userId
const authWithUserObj = (req, res, next) => {
  // Call the original authenticateToken middleware
  authenticateToken(req, res, (err) => {
    if (err) {
      return next(err);
    }
    
    // If authenticateToken succeeded, it will have set req.userId
    // Now transform that into req.user for the commentController
    if (req.userId) {
      req.user = { id: req.userId };
    }
    
    next();
  });
};

// Export the wrapped middleware
module.exports = authWithUserObj; 
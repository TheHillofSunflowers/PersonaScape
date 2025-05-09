const jwt = require("jsonwebtoken");

// Use explicit typing for the authenticateToken middleware
const authenticateToken = (req, res, next) => {
  console.log('⭐️ authenticateToken middleware called');
  console.log('Path:', req.path);
  console.log('Method:', req.method);
  
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader ? `Bearer ${authHeader.split(' ')[1].substring(0, 10)}...` : 'Missing');

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('❌ No Bearer token provided in Authorization header');
    res.status(401).json({ message: "No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];
  console.log('JWT_SECRET available:', process.env.JWT_SECRET ? 'Yes' : 'No');
  
  try {
    console.log('Attempting to verify token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('User ID from token:', decoded.userId);
    
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    // Try to decode the token without verification to see what's in it
    try {
      const decodedNoVerify = jwt.decode(token);
      console.log('Token contents (not verified):', decodedNoVerify);
    } catch (decodeErr) {
      console.error('Failed to decode token:', decodeErr);
    }
    
    res.status(403).json({ message: "Invalid token.", error: err instanceof Error ? err.message : 'Unknown error' });
    return;
  }
};

module.exports = {
  authenticateToken
}; 
// Load environment check first
require('./checkEnv');

// Express imports 
const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const likesRoutes = require('./routes/likesRoutes');
const publicRoutes = require('./routes/publicRoutes');

// Import middleware
const { requestLogger } = require('./middleware/debugMiddleware');

// Import Prisma client
const prisma = require('./prismaClient');

// Initialize Prisma client
async function initPrisma() {
  try {
    console.log('Attempting to connect to the database...');
    await prisma.$connect();
    console.log('Prisma client connected to database successfully');
    
    // Test query to ensure connection works
    const userCount = await prisma.user.count();
    console.log(`Database has ${userCount} users`);
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    process.exit(1);
  }
}

const app = express();

// More permissive CORS configuration for deployment
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://personascape.vercel.app'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      console.warn(`Origin ${origin} not allowed by CORS`);
      return callback(new Error('Not allowed by CORS'));
    }
    return callback(null, true);
  },
  credentials: true, // Enable credentials for auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Pragma'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // Cache preflight request for 24 hours
};

// Debug middleware to log all requests and responses
app.use(requestLogger);

// Apply CORS middleware first
app.use(cors(corsOptions));

// Parse JSON request body
app.use(express.json());

// Serve static files from the public directory
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Root route
app.get('/', (_req, res) => {
  res.send('Profile Builder API is running 🚀');
});

// Test route for CORS
app.get('/api/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS is working!',
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint for JWT verification
app.get('/api/debug-jwt', (req, res) => {
  const jwt = require('jsonwebtoken');
  
  // Create a test token with the current secret
  const testToken = jwt.sign(
    { test: 'data', timestamp: new Date().toISOString() },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  // Verify we can decode it (sanity check that JWT_SECRET is consistent)
  let verifiedToken;
  let error = null;
  
  try {
    verifiedToken = jwt.verify(testToken, process.env.JWT_SECRET);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }
  
  res.json({
    message: 'JWT debug information',
    secretAvailable: !!process.env.JWT_SECRET,
    secretFirstChars: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 4) + '...' : null,
    secretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
    testTokenCreated: !!testToken,
    testTokenVerified: !!verifiedToken,
    error,
  });
});

// Network diagnostics endpoint
app.get('/api/network-info', (req, res) => {
  const networkIPs = getNetworkIPs();
  
  res.json({
    message: 'Network diagnostics',
    serverTime: new Date().toISOString(),
    clientIP: req.ip || req.socket.remoteAddress,
    clientHeaders: req.headers,
    networkInterfaces: networkIPs,
    serverOptions: {
      port: PORT,
      host: HOST,
      corsOptions: corsOptions
    }
  });
});

// URL diagnostics endpoint
app.get('/api/url-info', (req, res) => {
  res.json({
    fullUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
    protocol: req.protocol,
    hostname: req.hostname,
    path: req.path,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    query: req.query,
    headers: req.headers,
    method: req.method
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/public', publicRoutes);

// Add 404 handler for API routes with a simple pattern
app.use('/api', (req, res) => {
  // Only handle routes that haven't been matched yet
  res.status(404).json({
    error: 'Not Found',
    message: `API endpoint not found: ${req.originalUrl}`,
    path: req.path
  });
});

// Fallback for all other routes
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head>
        <title>404 Not Found</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.5; }
          h1 { color: #e53e3e; }
          a { color: #3182ce; }
        </style>
      </head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The requested URL ${req.originalUrl} was not found on this server.</p>
        <p>Please check the URL or go back to the <a href="/">home page</a>.</p>
      </body>
    </html>
  `);
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Get available network interfaces
function getNetworkIPs() {
  const nets = os.networkInterfaces();
  const results = [];

  // Handle network interfaces safely
  if (nets) {
    for (const name of Object.keys(nets)) {
      const interfaces = nets[name];
      if (interfaces) {
        for (const net of interfaces) {
          // Skip internal and non-IPv4 addresses
          if (net.family === 'IPv4' && !net.internal) {
            results.push({
              name,
              address: net.address
            });
          }
        }
      }
    }
  }
  
  return results;
}

const PORT = Number(process.env.PORT || 5000);
const HOST = '0.0.0.0'; // Listen on all interfaces

// Start the server after initializing Prisma
initPrisma().then(() => {
  const server = app.listen(PORT, HOST, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`Test page available at: http://localhost:${PORT}/test.html`);
    
    // Log all network interfaces to help with debugging
    const networkIPs = getNetworkIPs();
    console.log('\n✅ Server is also accessible at:');
    networkIPs.forEach(({ name, address }) => {
      console.log(`- http://${address}:${PORT} (${name})`);
      console.log(`  Test page: http://${address}:${PORT}/test.html`);
    });
    
    console.log('\n💡 If you\'re having connection issues from your frontend, try using one of these IPs instead of localhost\n');
  });
  
  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`⚠️ Port ${PORT} is already in use. Try a different port.`);
    } else {
      console.error('Server error:', error);
    }
    process.exit(1);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 
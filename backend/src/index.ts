// Load environment check first
import './checkEnv';

import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import { requestLogger } from './middleware/debugMiddleware';
import { networkInterfaces } from 'os';

// Import Prisma client
import prisma from './prismaClient';

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

// More permissive CORS configuration for development
const corsOptions = {
  origin: '*', // Allow all origins in development
  credentials: true, // Enable credentials for proper auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // Cache preflight request for 24 hours
};

// Debug middleware to log all requests and responses
app.use(requestLogger);

// Apply CORS middleware first
app.use(cors(corsOptions));

// Handle OPTIONS requests explicitly - using a path pattern that express can handle
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // Return success for all OPTIONS requests
    res.status(204).end();
    return;
  }
  next();
});

// Parse JSON request body
app.use(express.json());

// Add CORS headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  next();
});

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
app.use('/profile', profileRoutes);

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
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Get available network interfaces
function getNetworkIPs() {
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    if (nets[name]) { // Check if nets[name] is defined
      for (const net of nets[name] || []) {
        // Skip internal and non-IPv4 addresses
        if (net.internal || net.family !== 'IPv4') continue;
        results.push({
          name,
          address: net.address
        });
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
  server.on('error', (error: any) => {
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

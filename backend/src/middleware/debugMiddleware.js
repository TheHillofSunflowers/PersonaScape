/**
 * Middleware to log all incoming requests and their responses
 */
const requestLogger = (req, res, next) => {
  const startTime = new Date().getTime();
  
  // Log request details
  console.log(`\n🔄 ${req.method} ${req.url}`);
  console.log(`📌 Origin: ${req.headers.origin || 'No origin header'}`);
  console.log(`📋 Headers: ${JSON.stringify(req.headers, null, 2)}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    // Sanitize sensitive information
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    console.log(`📦 Body: ${JSON.stringify(sanitizedBody, null, 2)}`);
  }
  
  // Add response logger
  const originalEnd = res.end;
  res.end = function(chunk, encoding, callback) {
    const endTime = new Date().getTime();
    const duration = endTime - startTime;
    
    console.log(`✅ Response: ${res.statusCode} ${res.statusMessage || ''}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    
    // Call the original end method
    return originalEnd.call(this, chunk, encoding, callback);
  };
  
  next();
};

module.exports = {
  requestLogger
}; 
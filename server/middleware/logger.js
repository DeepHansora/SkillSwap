export const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  // Log the request
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

  // Capture response time
  const start = Date.now();

  // Override res.end to log response details
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Log the response
    console.log(`[${timestamp}] ${method} ${url} - ${statusCode} - ${duration}ms`);
    
    // Call the original end function
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

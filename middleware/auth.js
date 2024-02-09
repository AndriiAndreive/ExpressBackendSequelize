const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 

const authMiddleware = (req, res, next) => {
  // Check if the authorization header is present
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user information to the request object
    req.user = decoded.user;
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
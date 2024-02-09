const adminMiddleware = (req, res, next) => {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Check if the user has admin role
    if (req.user.roleId !== 1) {// 1 is 'admin'
      return res.status(403).json({ message: 'Forbidden' });
    }
  
    // User has admin privileges, proceed to next middleware or route handler
    next();
};

module.exports = adminMiddleware;
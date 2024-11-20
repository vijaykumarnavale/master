const authorizeRole = (role) => {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden. You do not have the required permissions.' });
      }
      next();  // User has the correct role, so allow access to the route
    };
  };
  
  module.exports = authorizeRole;
  
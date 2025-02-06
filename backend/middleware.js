const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  });
}

// Admin role verification middleware
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
}

// Validation middleware 
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    return next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  validate
};
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'hospital-ops-secret-2024';

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  try {
    req.user = verifyToken(header.replace('Bearer ', ''));
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { signToken, verifyToken, authMiddleware };

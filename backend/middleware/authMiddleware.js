const jwt = require('jsonwebtoken');
const Citizen   = require('../models/Citizen');
const Authority = require('../models/Authority');

module.exports = async (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userType = decoded.type; // 'citizen' | 'authority'
    if (decoded.type === 'citizen') {
      req.user = await Citizen.findById(decoded.id).select('-passwordHash -otp');
    } else {
      req.user = await Authority.findById(decoded.id).select('-passwordHash');
    }
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

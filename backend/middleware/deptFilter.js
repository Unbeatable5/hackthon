// Restrict authority to only see complaints assigned to their department
// Must be used AFTER authMiddleware
module.exports = (req, res, next) => {
  if (req.userType !== 'authority') {
    return res.status(403).json({ error: 'Only authority accounts can access this resource' });
  }
  // Admin sees all
  if (req.user.role === 'admin') return next();

  // Inject dept filter into req so controllers can use it
  req.deptFilter = { assignedDept: req.user.department };
  next();
};

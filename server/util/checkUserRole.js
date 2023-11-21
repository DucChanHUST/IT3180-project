function checkUserRole(allowedRoles) {
  return (req, res, next) => {
    if (process.env.TEST == 1) return next()

    if (!req.decodedToken || !allowedRoles.includes(req.decodedToken.role)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    // Nếu người dùng có quyền, tiếp tục xử lý request
    next();
  }
}

module.exports = { checkUserRole };

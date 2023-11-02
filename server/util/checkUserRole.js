const jwt = require('jsonwebtoken');

// Middleware để kiểm tra quyền truy cập dựa trên vai trò
function checkUserRole(allowedRoles) {
  return (req, res, next) => {
    const authorization = req.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    
      try {
      req.decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
      if (!req.decodedToken || !allowedRoles.includes(req.decodedToken.role)) {
        return res.status(403).json({ error: 'Permission denied' });
      }
      // Nếu người dùng có quyền, tiếp tục xử lý request
      next();
      
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid'})
    }

  } else {
    return res.status(401).json({ error: 'token missing' })
    }
  }
}

module.exports = { checkUserRole };

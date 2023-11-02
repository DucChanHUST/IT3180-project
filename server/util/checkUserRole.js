const jwt = require('jsonwebtoken');


// Middleware để kiểm tra quyền truy cập dựa trên vai trò
function checkUserRole(allowedRoles) {
  return (request, response, next) => {
    const token = request.token; 


    if (!token) {
      return response.status(401).json({ error: 'Token is missing' });
    }


    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!decodedToken || !allowedRoles.includes(decodedToken.role)) {
        return response.status(403).json({ error: 'Permission denied' });
      }


      // Nếu người dùng có quyền, tiếp tục xử lý request
      next();
    } catch (error) {
      return response.status(401).json({ error: 'Invalid token' });
    }
  };
}


module.exports = { checkUserRole };


function verifyUser(req, res, next) {
  if (req.decodedToken.role === 'resident'){
    const userIdFromToken = String(req.decodedToken.id);
    const userIdFromParams = req.params.id;

    if (userIdFromToken !== userIdFromParams) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource' });
    }
  }
  
  next();
}

module.exports = { verifyUser };

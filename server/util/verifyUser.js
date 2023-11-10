
function verifyUser(req, res, next) {

  const userIdFromToken = String(req.decodedToken.id);
  const userIdFromParams = req.params.id;
  console.log(typeof userIdFromToken, typeof userIdFromParams, userIdFromToken, userIdFromParams);


  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource' });
  }

  next();
}

module.exports = { verifyUser };

const jwt = require('jsonwebtoken');

// funtion to generate valid token
const generateToken = (userId, username, role) => {
  const payload = {
    id: userId,
    username: username,
    role: role,
  };

  const secretKey = 'iloveu';

  const options = {
    expiresIn: '1h', 
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
};
module.exports = generateToken;
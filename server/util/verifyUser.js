
const { User, Registration, Resident } = require('../models/associations')

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

async function verifyResident(req, res, next) {

  if (req.decodedToken.role === 'resident'){
    const userIdFromToken = String(req.decodedToken.id);
    // check if user registration id 
    const user = await User.findByPk(userIdFromToken, {
      attributes: { include: ['residentId']},
      include: {
        model: Resident,
        attributes: { include: ['registrationId']},
        include: Registration,
      },
    });
    const registrationIdFromToken = String(user.resident.registrationId);
    const registrationIdFromParams = req.params.registrationId;

    if (registrationIdFromToken !== registrationIdFromParams) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource' });
    }
  }
  
  next();
}

module.exports = { verifyUser, verifyResident };

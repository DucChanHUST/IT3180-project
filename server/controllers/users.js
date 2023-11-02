const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Resident = require('../models/resident')

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password, role } = req.body;
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      name,
      passwordHash,
      role
    });

    res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ error })
  }
});

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

// Get user's residentInfo 
usersRouter.get('/residentInfo/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    const resident = await Resident.findOne({
      where: {
        idnum: user.username
      }
    })
    res.status(200).json(resident)
  } else {
    res.status(404).json({ error })
  }
})

// Get user's registrationInfo
usersRouter.get('/registrationInfo/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    const resident = await Resident.findOne({
      where: {
        idnum: user.username
      }
    })
    const resInReg = await Resident.findAll({
      where: {
        registrationId: resident.registrationId
      }
    })
    res.status(200).json(resInReg)
  } else {
    res.status(404).json({ error })
  }
})



module.exports = usersRouter
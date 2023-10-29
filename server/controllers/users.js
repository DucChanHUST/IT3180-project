const bcrypt  = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) =>{
    const users = await User.findAll()
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;
    try {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
  
      const newUser = await User.create({
        username,
        name,
        passwordHash,
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


module.exports = usersRouter
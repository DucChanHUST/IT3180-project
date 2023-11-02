const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const { Resident, User } = require('../models')

usersRouter.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {      
        model: Resident,
        attributes: { exclude: ['userId'] }    
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

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
    res.status(400).json({ error: 'Failed to create a new user' });
  }
});

usersRouter.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user by ID' });
  }
});

module.exports = usersRouter;

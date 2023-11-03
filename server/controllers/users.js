const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User, Registration, Resident } = require('../models/associations')
const { checkUserRole } = require('../util/checkUserRole');


usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash', 'residentId'] },
    include: {
      model: Resident,
    }
  })
  res.json(users)
})

usersRouter.post('/',checkUserRole(['leader']), async (req, res) => {
  const { username, password, role, residentId } = req.body;
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      passwordHash,
      role,
      residentId
    });

    res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ error })
  }
});

usersRouter.put('/:id', async (req, res) => {
  const { username, password, role, residentId } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Choose to update only the fields that are provided in the request
    if (username) {
      user.username = username;
    }
    if (password) {
      const saltRounds = 10;
      user.passwordHash = await bcrypt.hash(password, saltRounds);
    }
    if (role) {
      user.role = role;
    }
    if (residentId) {
      user.residentId = residentId;
    }

    // Save the updated user
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id,{
    attributes: { exclude: ['passwordHash', 'residentId'] },
    include: {
      model: Resident,
    }
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

usersRouter.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    await user.destroy();

    res.status(202).json("Delete successfully")
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = usersRouter
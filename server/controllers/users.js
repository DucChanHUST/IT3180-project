const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User, Registration, Resident } = require('../models/associations')
const { tokenExtractor } = require('../util/tokenExtractor');
const { checkUserRole } = require('../util/checkUserRole');
const { verifyUser } = require('../util/verifyUser');

usersRouter.use(tokenExtractor);

usersRouter.get('/', checkUserRole(['leader', 'accountant']), async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash', 'residentId'] },
    include: {
      model: Resident,
    }
  })
  res.json(users)
})

usersRouter.post('/', checkUserRole(['leader']), async (req, res) => {
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

usersRouter.put('/:id', verifyUser, async (req, res) => {
  const { password, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the old password is provided and matches the stored hash
    if (password) {
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid old password' });
      }

      // Update password only if the old password is provided and matches
      if (newPassword) {
        const saltRounds = 10;
        user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
        await user.save();
        return res.status(200).json({ message: 'Password updated successfully' });
      } else {
        return res.status(400).json({ error: 'New password is required for update' });
      }
    } else {
      return res.status(400).json({ error: 'Old password is required for password update' });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// GET user 's info
usersRouter.get('/:id', checkUserRole(['leader', 'resident', 'accountant']), verifyUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash', 'residentId'] },
      include: {
        model: Resident,
        attributes: { exclude: ['registrationId'] },
        include: {
          model: Registration,
          include: Resident
        }
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

usersRouter.delete('/:id', checkUserRole(['leader']), async (req, res) => {
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

usersRouter.post('/isCorrectPassword/:id', verifyUser, async (req, res) => {
  const password = req.body.password;
  try {
    const user = await User.findByPk(req.params.id);
    if (password) {
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        return res.status(200).json(0);
      } else {
        return res.status(200).json(1);
      }
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = usersRouter
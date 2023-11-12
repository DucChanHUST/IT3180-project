const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User, Registration, Resident } = require('../models/associations')
const { tokenExtractor } = require('../util/tokenExtractor');
const { checkUserRole } = require('../util/checkUserRole');
const { verifyUser } = require('../util/verifyUser');

usersRouter.use(tokenExtractor);

usersRouter.get('/',checkUserRole(['leader']), async (req, res) => {
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

usersRouter.put('/:id',verifyUser, async (req, res) => {
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

usersRouter.get('/:id',checkUserRole(['leader']), async (req, res) => {
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

//Get user's resident
usersRouter.get('/resident/:id', verifyUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: Resident,
      attributes: ['id', 'username', 'role'], // Add any other user attributes you want to include
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.resident) {
      return res.status(404).json({ error: 'Resident information not found for this user' });
    }

    res.json({ resident: user.resident });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET user 's registration
usersRouter.get('/registration/:id', verifyUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Resident,
        include: Registration,
      },
      attributes: ['id', 'username', 'role'], // Add any other user attributes you want to include
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.resident || !user.resident.registration) {
      return res.status(404).json({ error: 'Registration information not found for this user' });
    }

    res.json({ registration: user.resident.registration });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
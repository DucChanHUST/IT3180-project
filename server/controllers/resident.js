const residentRouter = require('express').Router()
const { User, Registration, Resident } = require('../models/associations')
const { tokenExtractor } = require('../util/tokenExtractor');
const { checkUserRole } = require('../util/checkUserRole');
const bcrypt = require('bcrypt')


residentRouter.use(tokenExtractor);

residentRouter.get('/', checkUserRole(['leader', 'accountant']), async (req, res) => {
  const listRes = await Resident.findAll({
    attributes: { exclude: ['registrationId'] },
    include: [
      {
        model: User,
        attributes: { exclude: ['passwordHash', 'residentId'] }
      },
      {
        model: Registration
      }
    ]
  })
  res.json(listRes)
});

residentRouter.get('/:id', checkUserRole(['leader', 'accountant']), async (req, res) => {
  try {
    const resident = await Resident.findByPk(req.params.id, {
      attributes: { exclude: ['registrationId'] },
      include: [
        {
          model: User,
          attributes: { exclude: ['passwordHash', 'residentId'] }
        },
        {
          model: Registration
        }
      ]
    });

    if (resident) {
      res.status(200).json(resident);
    } else {
      res.status(404).json({ error: 'Resident not found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

residentRouter.post('/add', checkUserRole(['leader']), async (req, res) => {
  try {
    const newRes = await Resident.create(req.body)
    res.status(201).json(newRes)
  } catch (error) {
    res.status(400).json({ error })
  }
})

residentRouter.put('/update/:id', checkUserRole(['leader']), async (req, res) => {
  try {
    const updateRes = await Resident.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
        {
          model: Registration
        }
      ]
    });
    if (updateRes) {
      // update user if update resident's idNumber
      const idNumber = req.body.idNumber; 
      const prevUsername = updateRes.idNumber;
      if (idNumber !== null && idNumber !== prevUsername) {
        const newUsername = idNumber;
        const newPasswordHash = await bcrypt.hash(newUsername, 10);
        const user = await User.findOne({
          where: {
            username: prevUsername
          }
        });
        if (user) {
          user.username = idNumber;
          user.passwordHash = newPasswordHash;
          await user.save();
        }else{
          // trường hợp thêm số CCCD cho 1 người chưa có số CCCD
          let residentId = updateRes.id;
          let role = 'resident';
          await User.create({
            username: newUsername,
            passwordHash: newPasswordHash,
            role,
            residentId
          });
        }
      }else{
        // trường hợp xóa số CCCD của một người
        if(idNumber === null && prevUsername !== null){
          await User.destroy({
            where:{
              username: prevUsername
            }
          });
        }
      }
      await updateRes.update(req.body);
      await updateRes.reload({
        include: [
          {
            model: User,
          },
          {
            model: Registration
          }
        ]
      });
      await updateRes.save();
      res.status(200).json(updateRes)
    } else {
      res.status(404).json('Resident not found')
    }
  } catch (error) {
    res.status(400).json({ error })
  }
})

residentRouter.delete('/delete/:id', checkUserRole(['leader']), async (req, res) => {
  try {
    const delRes = await Resident.findByPk(req.params.id)
    if (delRes) {
      await delRes.destroy()
      res.status(202).json("Delete successfully")
    } else {
      res.status(404).json("Resident not found")
    }
  } catch (error) {
    res.status(400).json({ error })
  }
})


module.exports = residentRouter
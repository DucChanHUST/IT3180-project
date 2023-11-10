const residentRouter = require('express').Router()
const { User, Registration, Resident } = require('../models/associations')
const { tokenExtractor } = require('../util/tokenExtractor');
const { checkUserRole } = require('../util/checkUserRole');

residentRouter.use(tokenExtractor);

residentRouter.get('/',checkUserRole(['leader']), async (req, res) => {
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

residentRouter.get('/:id',checkUserRole(['leader']), async (req, res) => {
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
      await updateRes.update(req.body)
      await updateRes.reload({ // Tải lại đối tượng để đảm bảo dữ liệu đã được cập nhật đầy đủ
        include: [
          {
            model: User,
          },
          {
            model: Registration
          }
        ]
      });
      await updateRes.save()
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
    if(delRes){
      await delRes.destroy()
      res.status(202).json("Delete successfully")
    }else{
      res.status(404).json("Resident not found")
    }
  } catch (error) {
    res.status(400).json({ error })
  }
})


module.exports = residentRouter
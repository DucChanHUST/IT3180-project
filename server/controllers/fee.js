const feeRouter = require('express').Router()
const { Fee } = require('../models/associations')
const { checkUserRole } = require('../util/checkUserRole')
const { tokenExtractor } = require('../util/tokenExtractor')

feeRouter.use(tokenExtractor)

feeRouter.get('/', async (req, res) => {
  const fees = await Fee.findAll()
  res.json(fees)
})

feeRouter.post('/',checkUserRole(['accountant']), async (req, res) => {
  var { nameFee, amount, type } = req.body;
  if (!amount) {
    if (type === 1) {
      return res.status(422).json({ error: 'Amount is required' })
    }
    else {
      amount = 0;
    }
  }
  try {
    const newFee = await Fee.create({
      nameFee,
      amount,
      type
    });

    res.status(201).json(newFee);
  } catch (error) {
    return res.status(400).json({ error })
  }
})

feeRouter.put('/:id',checkUserRole(['accountant']), async (req, res) => {
  const { nameFee, amount, type } = req.body;
  try {
    const fee = await Fee.findByPk(req.params.id);
    if (!fee) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    fee.nameFee = nameFee;
    fee.amount = amount;
    fee.type = type;
    await fee.save();

    res.status(200).json(fee);
  } catch (error) {
    return res.status(400).json({ error })
  }
})

feeRouter.delete('/:id',checkUserRole(['accountant']), async (req, res) => {
  try {
    const fee = await Fee.findByPk(req.params.id);
    if (!fee) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    await fee.destroy();

    res.status(204).end();
  } catch (error) {
    return res.status(400).json({ error })
  }
})

// search for fee by name, amount, type
feeRouter.get('/search', async (req, res) => {
  const { nameFee, amount, type } = req.query;
  const where = {}
  if (nameFee) where.nameFee = nameFee
  if (amount) where.amount = amount
  if (type) where.type = type
  const fees = await Fee.findAll({ where })
  res.json(fees)
})

// TODO upgrade search by name: regex
feeRouter.get('/search', async (req, res) => {
  const { nameFee } = req.params
  const fees = await Fee.findAll({
    where: {
      nameFee: {
        [Op.like]: `%${nameFee}%`
      }
    }
  })
  res.json(fees)
})

module.exports = feeRouter
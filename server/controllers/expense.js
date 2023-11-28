const expenseRouter = require('express').Router()
const { Expense } = require('../models/associations')
const { checkUserRole } = require('../util/checkUserRole')
const { tokenExtractor } = require('../util/tokenExtractor')

expenseRouter.use(tokenExtractor)

expenseRouter.get('/', async (req, res) => {
  const expenses = await Expense.findAll()
  res.json(expenses)
})

expenseRouter.post('/',checkUserRole(['accountant']), async (req, res) => {
  const { nameExpense, amount, type } = req.body;
  try {
    const newExpense = await Expense.create({
      nameExpense,
      amount,
      type
    });

    res.status(201).json(newExpense);
  } catch (error) {
    return res.status(400).json({ error })
  }
})

expenseRouter.put('/:id',checkUserRole(['accountant']), async (req, res) => {
  const { nameExpense, amount, type } = req.body;
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    expense.nameExpense = nameExpense;
    expense.amount = amount;
    expense.type = type;
    await expense.save();

    res.status(200).json(expense);
  } catch (error) {
    return res.status(400).json({ error })
  }
})

expenseRouter.delete('/:id',checkUserRole(['accountant']), async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await expense.destroy();

    res.status(204).end();
  } catch (error) {
    return res.status(400).json({ error })
  }
})

// search for expense by name, amount, type
expenseRouter.get('/search', async (req, res) => {
  const { nameExpense, amount, type } = req.query;
  const where = {}
  if (nameExpense) where.nameExpense = nameExpense
  if (amount) where.amount = amount
  if (type) where.type = type
  const expenses = await Expense.findAll({ where })
  res.json(expenses)
})

// TODO upgrade search by name: regex
expenseRouter.get('/search', async (req, res) => {
  const { nameExpense } = req.params
  const expenses = await Expense.findAll({
    where: {
      nameExpense: {
        [Op.like]: `%${nameExpense}%`
      }
    }
  })
  res.json(expenses)
})

module.exports = expenseRouter
const expenseRouter = require('express').Router()
const { Expense } = require('../models/associations')
const { checkUserRole } = require('../util/checkUserRole')

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
});

module.exports = expenseRouter
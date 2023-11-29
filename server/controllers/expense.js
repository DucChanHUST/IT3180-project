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
    const { registrationId, feeId, date } = req.body;
    if (!date) {
        date = new Date();
    }
    try {
        const newExpense = await Expense.create({
            registrationId,
            feeId,
            date
        });

        res.status(201).json(newExpense);
    } catch (error) {
        return res.status(400).json({ error })
    }
})

expenseRouter.get('/:registrationId', async (req, res) => {
    const expenses = await Expense.findAll({
        where: {
            registrationId: req.params.registrationId
        }
    })
    res.json(expenses)
})

expenseRouter.get('/:feeId',checkUserRole(['accountant']), async (req, res) => {
    const expenses = await Expense.findAll({
        where: {
            feeId: req.params.feeId
        }
    })
    res.json(expenses)
})

module.exports = expenseRouter
const expenseRouter = require('express').Router()
const { Fee, Expense, Registration } = require('../models/associations')
const { checkUserRole } = require('../util/checkUserRole')
const { tokenExtractor } = require('../util/tokenExtractor')
const { verifyResident } = require('../util/verifyUser')

expenseRouter.use(tokenExtractor)

expenseRouter.get('/',checkUserRole(['accountant', 'leader']), async (req, res) => {
    const expenses = await Expense.findAll()
    res.json(expenses)
})

expenseRouter.post('/',checkUserRole(['accountant']), async (req, res) => {
    var { registrationId, feeId, amount, date } = req.body;
    if (!date) {
        date = new Date();
    }
    // handle null
    const fee = await Fee.findByPk(feeId);
    if (!fee) {
        return res.status(404).json({ error: 'Fee not found' });
    }
    if (fee.type === 1) {
        amount = fee.amount;
    }
    const registration = await Registration.findByPk(registrationId);
    if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
    }
    try {
        const newExpense = await Expense.create({
            registrationId,
            feeId,
            amount,
            date
        });
        res.status(201).json(newExpense);
    } catch (error) {
        return res.status(400).json({ error })
    }
})

expenseRouter.get('/registration/:registrationId', verifyResident, async (req, res) => {
    const expenses = await Expense.findAll({
        where: {
            registrationId: req.params.registrationId
        }
    })
    res.json(expenses)
})

expenseRouter.get('/fee/:feeId',checkUserRole(['accountant', 'leader']), async (req, res) => {
    const expenses = await Expense.findAll({
        where: {
            feeId: req.params.feeId
        }
    })
    res.json(expenses)
})

expenseRouter.put('/',checkUserRole(['accountant']), async (req, res) => {
    const { registrationId, feeId, amount, date } = req.body;
    try {
        const expense = await Expense.findOne({
            where: {
                registrationId: registrationId,
                feeId: feeId
            }
        });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' })
        }
        const updatedExpense = await expense.update({
            registrationId,
            feeId,
            amount,
            date
        })
        res.status(200).json(updatedExpense)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

expenseRouter.delete('/',checkUserRole(['accountant']), async (req, res) => {
    const { registrationId, feeId } = req.body;
    try {
        const expense = await Expense.findOne({
            where: {
                registrationId: registrationId,
                feeId: feeId
            }
        });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' })
        }
        await expense.destroy();
        res.status(204).end();
    } catch (error) {
        return res.status(400).json({ error })
    }
})

module.exports = expenseRouter
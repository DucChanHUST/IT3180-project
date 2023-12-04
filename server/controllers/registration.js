const regRouter = require('express').Router()
const { User, Registration, Resident } = require('../models/associations')
const { tokenExtractor } = require('../util/tokenExtractor');
const { checkUserRole } = require('../util/checkUserRole');

regRouter.use(tokenExtractor);

regRouter.get('/',checkUserRole(['leader', 'accountant']), async(req, res) => {
    const listReg = await Registration.findAll({
        include: {
            model: Resident,
          }
    })
    res.json(listReg)
})

regRouter.get('/:regId',checkUserRole(['leader', 'accountant']), async(req, res) => {
    try {
        const reg = await Registration.findByPk(req.params.regId,{
            include: {
                model: Resident,
              }
        })
        if(reg){
            res.json(reg)
        }else{
            res.status(404).json("Registration not found")
        }
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
})

regRouter.post('/add', checkUserRole(['leader']), async(req, res) => {
    try {
        const newReg = await Registration.create(req.body)
        res.status(201).json(newReg)
    } catch (error) {
        res.status(400).json({error})
    }
})

regRouter.put('/update/:id', checkUserRole(['leader']), async(req, res) => {
    try {
        const updateReg = await Registration.findByPk(req.params.id)
        if(updateReg){
            updateReg.address = req.body.address
            await updateReg.save()
            res.status(200).json(updateReg)
        }else{
            res.status(404).json('Registration not found')
        }
    } catch (error) {
        res.status(400).json({  error: error.message})
    }
})

regRouter.delete('/delete/:id', checkUserRole(['leader']), async(req, res) => {
    try {
        const delReg = await Registration.findByPk(req.params.id)
        if(delReg){
            await delReg.destroy()
            res.status(202).json('Delete successfully')
        }else{
            res.status(404).json('Registration not found')
        }
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
})
module.exports = regRouter

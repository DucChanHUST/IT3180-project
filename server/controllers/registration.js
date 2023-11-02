const regRouter = require('express').Router()
const Reg = require('../models/registration')

regRouter.get('/', async(req, res) => {
    const listReg = await Reg.findAll()
    res.json(listReg)
})

regRouter.get('/:regId', async(req, res) => {
    const reg = await HoKhau.findByPk(req.params.regId)
    if(reg){
        res.json(reg)
    }else{
        res.status(401).json({error})
    }
})

regRouter.post('/add', async(req, res) => {
    try {
        const newReg = await Reg.create(req.body)
        res.status(201).json(newReg)
    } catch (error) {
        res.status(400).json({error})
    }
})

regRouter.put('/update/:id', async(req, res) => {
    const updateReg = await Reg.findByPk(req.params.id)
    if(updateReg){
        updateReg.address = req.body.address
        await updateReg.save()
        res.status(200).json({updateReg})
    }else{
        res.status.json('Registration not found')
    }
})

regRouter.delete('/delete/:id', async(req, res) => {
    const delReg = await Reg.findByPk(req.params.id)
    if(delReg){
        try {
            await Reg.destroy({
                where: {
                    id: req.params.id
                }
            })
            res.status(202).json('Delete successfully')
        } catch (error) {
            // Xóa sẽ không thành công nếu trong hộ khẩu có các nhân khẩu
            res.json({error})
        }
    }else{
        res.status(204).json('Registration not found')
    }
})

module.exports = regRouter
const residentRouter = require('express').Router()
const { User, Registration, Resident } = require('../models/associations')
const { checkUserRole } = require('../util/checkUserRole');

residentRouter.get('/', async (req, res) => {
    const listRes = await Resident.findAll({
        include: [
            {
                model: User,
            },
            {
                model: Registration
            }
        ]
    })
    res.json(listRes)
})


residentRouter.post('/add', checkUserRole(['leader']), async (req, res) => {
    try {
        const newRes = await Resident.create(req.body)
        res.status(201).json(newRes)
    } catch (error) {
        res.status(400).json({ error })
    }
})

residentRouter.put('/update/:id',checkUserRole(['leader']), async (req, res) => {
    const updateRes = await Resident.findByPk(req.params.id)
    if(updateRes){
       await updateRes.update(req.body)
       await updateRes.save()
       res.status(200).json(updateRes)
    }else{
        res.status(400).json('Resident not found')
    }
})

// nếu xóa resident thì có cần xóa tk user của resident đó k ?
residentRouter.delete('/delete/:id',checkUserRole(['leader']), async (req, res) => {
    const delRes = await Resident.findByPk(req.params.id)
    if(delRes){
        try {     
            await Resident.destroy({
                where: {
                    id: req.params.id
                }
            })
            res.status(202).json("Delete successfully")
        } catch (error) {
            res.json({ error })
        }
    }else{
        res.status(400).json('Resident not found')
    }
})


module.exports = residentRouter
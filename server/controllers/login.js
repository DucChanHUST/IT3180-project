const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { User, Registration, Resident } = require('../models/associations')

loginRouter.post('/', async (request, response) =>{
    const {username, password} = request.body

    const user = await User.findOne({
      where: {
        username: username
      }
    })
    const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

    if(!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id,
        role: user.role
    }

    const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        {expiresIn: 60*60}
    )

    response
        .status(200)
        .send({token, userId: user.id, userRole: user.role})
})

module.exports = loginRouter
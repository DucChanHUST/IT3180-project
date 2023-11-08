const Registration = require('./registration')
const Resident = require('./resident')
const User = require('./user')
const Expense = require('./expense')

Registration.hasMany(Resident)
Resident.belongsTo(Registration)

Resident.hasOne(User)
User.belongsTo(Resident)

Resident.sync({ alter: true })
Registration.sync({ alter: true })
User.sync({ alter: true})

module.exports = {
    User, Registration, Resident, Expense
  }

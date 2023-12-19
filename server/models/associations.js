const Registration = require('./registration')
const Resident = require('./resident')
const User = require('./user')
const Fee = require('./fee')
const Expense = require('./expense')

Registration.hasMany(Resident)
Resident.belongsTo(Registration)

Resident.hasOne(User)
User.belongsTo(Resident)

Registration.belongsToMany(Fee, { through: 'expenses' });
Fee.belongsToMany(Registration, { through: 'expenses' });

Resident.sync({ alter: true })
Registration.sync({ alter: true })
User.sync({ alter: true})
Fee.sync({ alter: true})
Expense.sync({ alter: true })

module.exports = {
  User, Registration, Resident, Fee, Expense
}

const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Expense extends Model {}

Expense.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  registrationId:{
    type: DataTypes.INTEGER,
    allowNull: true,
    onDelete: 'SET NULL',
    references: { model: 'registrations', key: 'id' },
  },
  feeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'fees', key: 'id' },
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'expense'
})

Expense.sync({ alter: true })

module.exports = Expense
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
  },
  feeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
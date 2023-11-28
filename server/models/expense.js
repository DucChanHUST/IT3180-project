const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Expense extends Model {}

Expense.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nameExpense: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'expense'
})

Expense.sync({ alter: true })

module.exports = Expense
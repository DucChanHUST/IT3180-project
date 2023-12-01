const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Fee extends Model {}

Fee.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nameFee: {
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
  modelName: 'fee'
})

Fee.sync({ alter: true })

module.exports = Fee
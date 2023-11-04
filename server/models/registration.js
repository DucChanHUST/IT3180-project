const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Registration extends Model {}

Registration.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'registration'
})


Registration.sync({ alter: true })
module.exports = Registration
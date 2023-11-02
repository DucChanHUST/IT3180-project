const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')
class Resident extends Model {}

Resident.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idnum: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  relationship: {
    type: DataTypes.STRING,
    allowNull: false
  },
  registrationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "registrations",
      key: "id"
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'resident'
})


Resident.sync({ alter: true })

module.exports = Resident
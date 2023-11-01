const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class KhoanThu extends Model {}

KhoanThu.init({
  maKhoanThu: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tenKhoanThu: {
    type: DataTypes.STRING,
    allowNull: false
  },
  soTien: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  loaiKhoanThu: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'khoan_thu'
})

KhoanThu.sync({ alter: true })

module.exports = KhoanThu
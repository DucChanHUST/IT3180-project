// const { Model, DataTypes } = require('sequelize')

// const { sequelize } = require('../util/db')

// class NopTien extends Model {}

// NopTien.init({
//   IDNopTien: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   maExpense: {
//     // TODO foreign key
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     allowNull: false
//   },
//   ngayThu: {
//     type: DataTypes.DATE,
//     allowNull: false
//   },
// }, {
//   sequelize,
//   underscored: true,
//   timestamps: false,
//   modelName: 'nop_tien'
// })

// NopTien.sync({ alter: true })

// module.exports = NopTien
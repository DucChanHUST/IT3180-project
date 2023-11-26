// const { Model, DataTypes } = require('sequelize')
// const { sequelize } = require('../util/db')

// const Fee = require('./fee');
// const Registration = require('./registration');

// // class Expense extends Model {}
// const Expense = sequelize.define('Expense', {
//   date: {
//     type: DataTypes.DATE,
//   },
// }, 
// // {
// //   // Define a composite primary key
// //   primaryKey: true,
// //   uniqueKeys: {
// //     expense_unique: {
// //       fields: ['fee_id', 'registration_id'],
// //     },
// //   },
// // }
// );

// // // Define associations
// // Expense.belongsTo(Fee);
// // Expense.belongsTo(Registration);

// module.exports = Expense;

const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Expense extends Model {}

Expense.init({
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
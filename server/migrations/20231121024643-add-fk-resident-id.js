'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'residentId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'residents', // The name of the target table
        key: 'id',      // The name of the target column
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'residentId');
  },
};

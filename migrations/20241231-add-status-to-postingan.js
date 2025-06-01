'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('postingan', 'status', {
      type: Sequelize.ENUM('aktif', 'terarsip'),
      defaultValue: 'aktif',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('postingan', 'status');
  }
};

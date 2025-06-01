'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('interaksi', 'status', {
      type: Sequelize.ENUM('aktif', 'diabaikan', 'diselesaikan'),
      allowNull: false,
      defaultValue: 'aktif',
      after: 'alasan_laporan'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('interaksi', 'status');
  }
};

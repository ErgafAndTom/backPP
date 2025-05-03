'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'manufacturingStartTime', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Orders', 'finalManufacturingTime', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Orders', 'totalManufacturingTimeSeconds', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'manufacturingStartTime');
    await queryInterface.removeColumn('Orders', 'finalManufacturingTime');
    await queryInterface.removeColumn('Orders', 'totalManufacturingTimeSeconds');
  }
}; 
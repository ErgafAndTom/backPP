const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const InLifeHackPhoto = sequelize.define("InLifeHackPhoto", {
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    LifeHackCardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'LifeHackCards', // Таблиця, до якої посилається
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  InLifeHackPhoto.associate = (models) => {
    InLifeHackPhoto.belongsTo(models.LifeHackCard, { foreignKey: 'LifeHackCardId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    InLifeHackPhoto.belongsTo(models.User, { foreignKey: 'createdById', as: 'createdBy', onDelete: 'SET NULL' });
  };

  return InLifeHackPhoto;
};

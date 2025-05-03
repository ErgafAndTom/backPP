const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const LifeHackList = sequelize.define("LifeHackList", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    assignedToId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  LifeHackList.associate = (models) => {
    LifeHackList.hasMany(models.LifeHackCard, {foreignKey: "LifeHackListId", onDelete: "CASCADE"});
    LifeHackList.belongsTo(models.User, {foreignKey: "createdById", as: "createdBy", onDelete: "SET NULL"});
    LifeHackList.belongsTo(models.User, {foreignKey: "assignedToId", as: "assignedTo", onDelete: "SET NULL"});
  };

  return LifeHackList;
};

const {DataTypes} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const LifeHackCard = sequelize.define("LifeHackCard", {
        content: {
            type: DataTypes.TEXT, allowNull: true
        },
        type: {
            type: DataTypes.STRING, allowNull: false, defaultValue: "text"
        },
        LifeHackListId: {
            type: DataTypes.INTEGER, allowNull: false, references: {
                model: 'LifeHackLists', // Таблиця, до якої посилається
                key: 'id',
            },
            onDelete: 'CASCADE', onUpdate: 'CASCADE',
        },
        createdById: {
            type: DataTypes.INTEGER, allowNull: true
        },
        lastUpdatedById: {
            type: DataTypes.INTEGER, allowNull: true
        },
        assignedToId: {
            type: DataTypes.INTEGER, allowNull: true
        }
    });

    LifeHackCard.associate = (models) => {
        LifeHackCard.belongsTo(models.LifeHackList, {foreignKey: 'LifeHackListId', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
        LifeHackCard.belongsTo(models.User, {as: 'createdBy', foreignKey: 'createdById', onDelete: 'SET NULL'});
        LifeHackCard.belongsTo(models.User, {as: 'lastUpdatedBy', foreignKey: 'lastUpdatedById', onDelete: 'SET NULL'});
        LifeHackCard.belongsTo(models.User, {as: 'assignedTo', foreignKey: 'assignedToId', onDelete: 'SET NULL'});
        LifeHackCard.hasMany(models.InLifeHackPhoto, {foreignKey: 'LifeHackCardId', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
    };

    return LifeHackCard;
};

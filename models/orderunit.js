const {DataTypes} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const OrderUnit = sequelize.define('OrderUnit', {
        id: {
            type: DataTypes.INTEGER,
        },
        idKey: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        typeUse: {
            type: DataTypes.STRING,
        },
        idInStorageUnit: {
            type: DataTypes.STRING
        },
        units: {
            type: DataTypes.STRING
        },
        quantity: {
            type: DataTypes.INTEGER
        },
        amount: {
            type: DataTypes.INTEGER
        },
        priceForOneThis: {
            type: DataTypes.STRING
        },
        priceForThis: {
            type: DataTypes.STRING
        },
        priceForAllThis: {
            type: DataTypes.STRING
        },
        x: {
            type: DataTypes.STRING
        },
        y: {
            type: DataTypes.STRING
        },
        xInStorage: {
            type: DataTypes.STRING
        },
        yInStorage: {
            type: DataTypes.STRING
        },
        price1: {
            type: DataTypes.STRING
        },
        price2: {
            type: DataTypes.STRING
        },
        price3: {
            type: DataTypes.STRING
        },
        price4: {
            type: DataTypes.STRING
        },
        price5: {
            type: DataTypes.STRING
        },
        newField1: {
            type: DataTypes.STRING
        },
        newField2: {
            type: DataTypes.STRING
        },
        newField3: {
            type: DataTypes.STRING
        },
        newField4: {
            type: DataTypes.STRING
        },
        newField5: {
            type: DataTypes.STRING
        },
    });

    OrderUnit.associate = (models) => {
        OrderUnit.hasMany(models.OrderUnitUnit, {
            foreignKey: 'orderUnitIdKey',
            as: 'OrderUnitUnits',
            onDelete: 'CASCADE'
        });
        OrderUnit.belongsTo(models.Order, { foreignKey: 'orderId' });
        // OrderUnit.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    };

    return OrderUnit
};
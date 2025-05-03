const {DataTypes} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'id',
        },
        description: DataTypes.TEXT,
        status: {
            type: DataTypes.STRING,
            defaultValue: 'new',
        },
        executorId: {
            type: DataTypes.INTEGER,
            comment: 'Исполнитель',
            defaultValue: 0,
        },
        prepayment: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.STRING,
        },
        allPrice: {
            type: DataTypes.FLOAT,
        },
        clientId: {
            type: DataTypes.INTEGER,
            comment: 'Клиент',
            defaultValue: 0,
        },
        payForm: {
            type: DataTypes.STRING,
        },
        payStatus: {
            type: DataTypes.STRING,
        },
        barcode: {
            type: DataTypes.STRING,
        },
        newField1: {
            type: DataTypes.STRING,
        },
        newField2: {
            type: DataTypes.STRING,
        },
        newField3: {
            type: DataTypes.STRING,
        },
        newField4: {
            type: DataTypes.STRING,
        },
        newField5: {
            type: DataTypes.STRING,
        },
        manufacturingStartTime: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Час початку виготовлення'
        },
        finalManufacturingTime: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Фінальний час виготовлення'
        },
        totalManufacturingTimeSeconds: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Загальний час виготовлення в секундах'
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            comment: 'Час ння запису',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Час створення запису',
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
            comment: 'Час останнього оновлення запису',
        },
    });

    Order.associate = (models) => {
        Order.hasMany(models.OrderUnit, {
            foreignKey: 'orderId',
            onDelete: 'CASCADE'
        });
        // Order.hasMany(models.OrderUnit, { foreignKey: 'orderId', as: 'orderUnits' });
        Order.belongsTo(models.User, {
            foreignKey: 'executorId',
            as: 'executor'
        });
        Order.belongsTo(models.User, {
            foreignKey: 'clientId',
            as: 'client'
        });
        Order.belongsToMany(models.Material, {
            through: 'OrderMaterials',
            foreignKey: 'orderId',
        });
        Order.hasMany(models.InOrderFile, {as: 'inOrderFile', foreignKey: 'orderId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Order.hasMany(models.InOrderComment, {as: 'inOrderComment', foreignKey: 'orderId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    };

    return Order
};
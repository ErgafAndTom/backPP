const {DataTypes} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Device = sequelize.define('Device', {
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
            type: DataTypes.STRING,
            comment: 'Исполнитель',
        },
        prepayment: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.STRING,
        },
        allPrice: {
            type: DataTypes.STRING,
        },
        clientId: {
            type: DataTypes.STRING,
            comment: 'Клиент',
        },
        payForm: {
            type: DataTypes.STRING,
        },
        payStatus: {
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
    });

    Device.associate = (models) => {

    };

    return Device
};
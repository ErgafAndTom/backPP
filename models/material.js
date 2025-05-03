const {DataTypes} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Material = sequelize.define('Material', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        article: {
            type: DataTypes.STRING,
            allowNull: true,
            // unique: true,
            defaultValue: 0,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "НЕ БыЛО name",
        },
        type: {
            type: DataTypes.STRING,
        },
        typeUse: {
            type: DataTypes.STRING,
        },
        description: DataTypes.STRING,
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true,
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true,
        },
        amountAll: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'шт.',
        },
        thickness: {
            type: DataTypes.STRING,
        },
        cost: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '5',
        },
        price1: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '10',
        },
        price2: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '9',
        },
        price3: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '8',
        },
        price4: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '7',
        },
        price5: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '6',
        },
        x: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '297',
        },
        y: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '420',
        },
        created: {
            type: DataTypes.STRING
        },
    });

    // Ассоциации, если есть
    Material.associate = (models) => {
        // Например, материалы могут быть связаны с заказами через таблицу связей

        Material.belongsToMany(models.Order, {
            through: 'OrderMaterials',
            foreignKey: 'materialId',

        });
    };
    // Material.beforeFind((options) => {
    //     if (options.attributes && Array.isArray(options.attributes)) {
    //         options.attributes = options.attributes.filter(attribute => permittedFields.includes(attribute));
    //     }
    // });
    return Material;
};

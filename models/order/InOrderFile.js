module.exports = (sequelize, DataTypes) => {
    const InOrderFile = sequelize.define('InOrderFile', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fileLink: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'fileLink користувача',
            defaultValue: null,
        },
        fileName: {
            type: DataTypes.STRING,
            unique: false,
        },
        whatTheServiceForPhotoContains: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        // orderId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: 'Order', // Таблиця, до якої посилається
        //         key: 'id',
        //     },
        //     onDelete: 'CASCADE',
        //     onUpdate: 'CASCADE',
        // },
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
            comment: 'Час останнього оновлення',
        },
    });

    InOrderFile.associate = (models) => {
        InOrderFile.belongsTo(models.Order, { foreignKey: 'orderId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        InOrderFile.belongsTo(models.User, {as: 'createdBy', foreignKey: 'createdById', onDelete: 'SET NULL'});
    };

    return InOrderFile;
};
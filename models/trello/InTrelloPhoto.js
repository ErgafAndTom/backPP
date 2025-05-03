module.exports = (sequelize, DataTypes) => {
    const InTrelloPhoto = sequelize.define('InTrelloPhoto', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        photoLink: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'photoLink користувача',
            defaultValue: null,
        },
        photoName: {
            type: DataTypes.STRING,
            unique: true,
        },
        whatTheServiceForPhotoContains: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        cardId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Cards', // Таблиця, до якої посилається
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
            comment: 'Час останнього оновлення',
        },
    });

    InTrelloPhoto.associate = (models) => {
        InTrelloPhoto.belongsTo(models.Card, { foreignKey: 'cardId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        InTrelloPhoto.belongsTo(models.User, {as: 'createdBy', foreignKey: 'createdById', onDelete: 'SET NULL'});
    };

    return InTrelloPhoto;
};
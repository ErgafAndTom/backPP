module.exports = (sequelize, DataTypes) => {
    const InOrderComment = sequelize.define('InOrderComment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        comment: {
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

    InOrderComment.associate = (models) => {
        InOrderComment.belongsTo(models.Order, { foreignKey: 'orderId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        InOrderComment.belongsTo(models.User, {as: 'createdBy', foreignKey: 'createdById', onDelete: 'SET NULL'});
    };

    return InOrderComment;
};
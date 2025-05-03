module.exports = (sequelize, DataTypes) => {

    const Card = sequelize.define('Card', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
        },
        type: {
            type: DataTypes.STRING,
        },
        listId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Lists', // Таблиця, до якої посилається
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    });


    Card.associate = (models) => {
        Card.belongsTo(models.List, { foreignKey: 'listId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Card.belongsTo(models.User, {as: 'createdBy', foreignKey: 'createdById', onDelete: 'SET NULL'});
        Card.belongsTo(models.User, {as: 'lastUpdatedBy', foreignKey: 'lastUpdatedById', onDelete: 'SET NULL'});
        Card.belongsTo(models.User, {as: 'assignedTo', foreignKey: 'assignedToId', onDelete: 'SET NULL'});
        Card.hasMany(models.InTrelloPhoto, {as: 'inTrelloPhoto', foreignKey: 'cardId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    };


    return Card;
};
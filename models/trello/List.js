module.exports = (sequelize, DataTypes) => {

    const List = sequelize.define('List', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });


    List.associate = (models) => {
        List.hasMany(models.Card, { foreignKey: 'listId', onDelete: 'CASCADE' });
        List.belongsTo(models.User, {as: 'createdBy', foreignKey: 'createdById', onDelete: 'SET NULL'});
        List.belongsTo(models.User, {as: 'assignedTo', foreignKey: 'assignedToId', onDelete: 'SET NULL'});
    };

    return List;
};
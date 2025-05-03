module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
        sid: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        userId: DataTypes.STRING,
        expires: DataTypes.DATE,
        data: DataTypes.TEXT,
    });

    Session.associate = (models) => {
        Session.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Session;
};
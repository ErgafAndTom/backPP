module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Ім\'я користувача',
            defaultValue: null,
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Прізвище користувача',
            defaultValue: null,
        },
        familyName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'family користувача',
            defaultValue: null,
        },
        email: {
            type: DataTypes.STRING(150),
            // allowNull: false,
            // unique: true,
            // validate: {
            //     isEmail: true,
            // },
            comment: 'Електронна пошта користувача',
            defaultValue: null,
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: 'Номер телефону користувача',
            defaultValue: null,
        },
        signal: {
            type: DataTypes.STRING(40),
            allowNull: true,
            comment: 'signal користувача',
            defaultValue: null,
        },
        viber: {
            type: DataTypes.STRING(40),
            allowNull: true,
            comment: 'viber користувача',
            defaultValue: null,
        },
        whatsapp: {
            type: DataTypes.STRING(40),
            allowNull: true,
            comment: 'whatsapp користувача',
            defaultValue: null,
        },
        telegram: {
            type: DataTypes.STRING(40),
            allowNull: true,
            comment: 'telegram користувача',
            defaultValue: null,
        },
        discount: {
            type: DataTypes.STRING(40),
            allowNull: true,
            comment: 'знижка',
            defaultValue: null,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user',
            // allowNull: false,
            comment: 'Роль користувача в системі',
        },
        role2: {
            type: DataTypes.STRING,
            defaultValue: 'user',
            // allowNull: false,
            comment: 'Роль користувача в системі',
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Статус активності користувача',
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Час останнього входу користувача',
            defaultValue: null,
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

    User.associate = (models) => {
        User.hasMany(models.Order, { foreignKey: 'clientId' });
        User.hasMany(models.Order, { foreignKey: 'executorId' });
        User.hasMany(models.Session, { foreignKey: 'userId' });
        User.hasMany(models.InOrderFile, { foreignKey: 'createdById' });
        User.hasMany(models.InOrderComment, { foreignKey: 'createdById' });
        User.hasMany(models.Contractor, { foreignKey: 'userId' });
    };

    return User;
};

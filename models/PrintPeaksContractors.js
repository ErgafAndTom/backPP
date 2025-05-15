module.exports = (sequelize, DataTypes) => {
    const PrintPeaksContractor = sequelize.define("PrintPeaksContractor", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'id',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
        },
        contractorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    PrintPeaksContractor.associate = (models) => {
        PrintPeaksContractor.belongsTo(models.Contractor, {
            foreignKey: 'contractorId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return PrintPeaksContractor;
};
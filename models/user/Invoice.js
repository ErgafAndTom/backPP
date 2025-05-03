const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define("Invoice", {
    userInvoiceDetailsId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    recipientName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    recipientAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "UAH"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.InvoiceDetails, {foreignKey: "invoiceDetailsId", onDelete: "SET NULL"});
    Invoice.hasMany(models.InvoiceItem, {foreignKey: "invoiceId", onDelete: "CASCADE"});
  };

  return Invoice;
};
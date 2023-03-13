const { DataTypes } = require("sequelize");
const WaterBill = require("../models/WaterBill");
const AssocDue = require("../models/AssocDue");
module.exports  

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define("Invoice", {
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    invoice_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    due_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
  });
  /*Invoice.associate = function(models) {
    Invoice.belongsTo(models.WaterBill);
    Invoice.belongsTo(models.AssocDue);
  };*/
  return Invoice;   
};

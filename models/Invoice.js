const { DataTypes } = require("sequelize");
const WaterBill = require("../models/WaterBill");
const AssocDue = require("../models/AssocDue");
module.exports  

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define("Invoice", {
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
  });
  Invoice.associate = function(models) {
    Invoice.belongsTo(models.WaterBill,{foreignKey: 'waterbill_id'});
    Invoice.belongsTo(models.AssocDue,{foreignKey: 'assocdue_id'});
  };
  //sequelize.sync({alter: true})
  return Invoice;   
};

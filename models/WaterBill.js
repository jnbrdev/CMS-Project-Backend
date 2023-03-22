const { DataTypes } = require("sequelize");
const Invoice = require("../models/Invoice");
module.exports  

module.exports = (sequelize, DataTypes) => {
  const WaterBill = sequelize.define("WaterBill", {
    unit_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billed_to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prev_read: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    cur_read: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reading_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
  });
  WaterBill.associate = function(models) {
    WaterBill.hasMany(models.Invoice,{foreignKey: 'waterbill_id'});
  };
  
  return WaterBill;   
};

const { DataTypes } = require("sequelize");
const Invoice = require("../models/Invoice");
module.exports  

module.exports = (sequelize, DataTypes) => {
  const AssocDue = sequelize.define("AssocDue", {
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
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  AssocDue.associate = function(models) {
    AssocDue.hasMany(models.Invoice,{foreignKey: 'assocdue_id'});
  };
  //sequelize.sync({alter: true})

  return AssocDue;   
};

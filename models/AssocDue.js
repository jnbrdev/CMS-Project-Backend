const { DataTypes } = require("sequelize");
const Invoice = require("../models/Invoice");
module.exports  

module.exports = (sequelize, DataTypes) => {
  const AssocDue = sequelize.define("AssocDue", {
    unit_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
  });
  AssocDue.associate = function(models) {
    AssocDue.hasMany(models.Invoice,{foreignKey: 'assocdue_id'});
  };
  
  return AssocDue;   
};

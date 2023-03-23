const { DataTypes } = require("sequelize");

module.exports;

module.exports = (sequelize, DataTypes) => {
  const Guest = sequelize.define("Guest", {
    guest_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_from: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    date_to: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    
  });
  /*Invoice.associate = function(models) {
    Invoice.belongsTo(models.WaterBill);
    Invoice.belongsTo(models.AssocDue);
  };*/
  return Guest;
};

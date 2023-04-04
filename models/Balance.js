const { DataTypes } = require("sequelize");
const Users = require("../models/Users");
module.exports = (sequelize, DataTypes) => {
  const Balance = sequelize.define("Balance", {
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
    },
    thirty_days: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
    },
    sixty_days: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
    },
    ninety_days: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
    },
   
  });
  
 //sequelize.sync({alter: true})
  return Balance;
};

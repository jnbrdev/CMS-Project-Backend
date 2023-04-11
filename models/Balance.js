const { DataTypes } = require("sequelize");
const Users = require("../models/Users");
module.exports = (sequelize, DataTypes) => {
  const Balance = sequelize.define("Balance", {
    unit_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    total: {
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
    current_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    thirtyDays_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    sixtyDays_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ninetyDays_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  });
  
 //sequelize.sync({alter: true})
  return Balance;
};

const { DataTypes } = require("sequelize");
const Users = require("../models/Users");
module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define("Unit", {
    unit_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit_owner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unit_tower: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit_floor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    occupied_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Unit.associate = function(models) {
    Unit.belongsTo(models.Users);
  };
  return Unit;
};

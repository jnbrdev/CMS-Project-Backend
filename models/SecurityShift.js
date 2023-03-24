const { DataTypes } = require("sequelize");
const  Users  = require("../models/Users");
module.exports;

module.exports = (sequelize, DataTypes) => {
  const SecurityShift = sequelize.define("SecurityShift", {
    security_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tower_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shift_start: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shift_end: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
  });
  SecurityShift.associate = function(models) {
        SecurityShift.belongsTo(models.Users);
  };
  //sequelize.sync({alter: true})
  return SecurityShift;
};

const { DataTypes } = require("sequelize");
const Unit = require("../models/Unit");
const SecurityShift = require("../models/SecurityShift");
module.exports  

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Users.associate = function(models) {
    Users.hasMany(models.Unit,{foreignKey: 'userId'});
    //Users.hasMany(models.SecurityShift,{foreignKey: 'user_id'});
  };
  
  //sequelize.sync({alter: true})
  
  return Users;
};

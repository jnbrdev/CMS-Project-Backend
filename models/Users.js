const { DataTypes } = require("sequelize");
const Unit = require("../models/Unit");
const Agent = require("../models/Agent");

module.exports  

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unit_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    acc_balance: {
      type: DataTypes.DECIMAL(10,2),
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
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
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
    Users.hasMany(models.Agent,{foreignKey: 'userId'});
    //Users.hasMany(models.SecurityShift,{foreignKey: 'user_id'});
  };
  
  //sequelize.sync({alter: true})
  
  return Users;
};

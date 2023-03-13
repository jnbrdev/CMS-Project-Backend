const { DataTypes } = require("sequelize");
const Unit = require("../models/Unit");
module.exports  

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
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
  };
  
  return Users;
};

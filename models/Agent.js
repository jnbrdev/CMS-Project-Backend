const { DataTypes } = require("sequelize");
const Users = require("../models/Users");
module.exports = (sequelize, DataTypes) => {
  const Agent = sequelize.define("Agent", {
    agent_company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
  });
  
 //sequelize.sync({alter: true})
  return Agent;
};

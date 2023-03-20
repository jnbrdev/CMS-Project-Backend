const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

    const Service = sequelize.define("Service", {
        service_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return Service
}
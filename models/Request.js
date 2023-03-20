const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

    const Request = sequelize.define("Request", {
        unit_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        req_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        req_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        req_body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        req_date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        req_status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return Request
}
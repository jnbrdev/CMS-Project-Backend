const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

    const Rate = sequelize.define("Rate", {
        ratePerSqm: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        assocDueRate: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        discountRate: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ratePerCubic: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        penaltyRate: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        penaltyDate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    //sequelize.sync({alter: true})
    return Rate
}
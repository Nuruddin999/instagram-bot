const { Sequelize } = require("sequelize");
const accauntname = require("../constants")
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(`DirectUser`, {
        pk: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};
const { Sequelize } = require("sequelize");
const accauntname=require("../constants")
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(`LastAccaunt`, {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};
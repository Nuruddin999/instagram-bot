const { Sequelize } = require("sequelize");
const accauntname=require("../constants")
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(`Speaker_${accauntname.ACCAUNTS}`, {
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
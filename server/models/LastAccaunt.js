const { Sequelize } = require("sequelize");
const accauntname=require("../constants")
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(`LastAccaunt_${accauntname.ACCAUNTS}`, {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};
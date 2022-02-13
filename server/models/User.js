const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(`User`, {
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
const pg = require("pg");
const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../models/User");
const LastAccauntModel = require("../models/LastAccaunt")
const SpeakerModel = require("../models/Speaker")
const ForDirectModel = require("../models/ForDirect")
const DirectUserModel = require("../models/DirectUser")
const constants = require("../constants")
const sequelize = new Sequelize(constants.DB_NAME, constants.DB_USER, constants.DB_PASSWORD, {
    dialect: 'postgres'
});
(async () => await sequelize.sync({ alter: true }))();

const User = UserModel(sequelize, DataTypes);
const LastAccaunt = LastAccauntModel(sequelize, DataTypes);
const Speaker = SpeakerModel(sequelize, DataTypes)
const ForDirect = ForDirectModel(sequelize, DataTypes)
const DirectUser = DirectUserModel(sequelize, DataTypes)
module.exports = {
    User,
    LastAccaunt,
    Speaker,
    ForDirect,
    DirectUser
};
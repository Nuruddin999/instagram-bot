const { Op } = require("sequelize");
const {  User} = require("../db/sequelize");
const asyncHandler = require("../middlewares/asyncHandler");




exports.getUsers = asyncHandler(async (req, res, next) => {
const users=await  User.findAll()
    res.status(200).json({ success: true, data: users });
});
exports.newUser = asyncHandler(async (req, res, next) => {
    const user = await User.create({
        ...req.body
    });
    res.status(200).json({ success: true, data: user });
});
exports.findOrCreateUser= asyncHandler(async (req, res, next) => {
    const user = await User.findOrCreate({
        where:{   ...req.body}
    });
    res.status(200).json({ success: true, data: user});
});
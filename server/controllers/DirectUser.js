const { Op } = require("sequelize");
const { DirectUser } = require("../db/sequelize");
const asyncHandler = require("../middlewares/asyncHandler");




exports.getDirectUsers = asyncHandler(async (req, res, next) => {
    const users = await DirectUser.findAll()
    res.status(200).json({ success: true, data: users });
});
exports.newDirectUser = asyncHandler(async (req, res, next) => {
    const user = await DirectUser.create({
        ...req.body
    });
    res.status(200).json({ success: true, data: user });
});
exports.findOrCreateDirectUser = asyncHandler(async (req, res, next) => {
    const user = await DirecrtUser.findOrCreate({
        where: { ...req.body }
    });
    res.status(200).json({ success: true, data: user });
});
const { Op } = require("sequelize");
const {  LastAccaunt} = require("../db/sequelize");
const asyncHandler = require("../middlewares/asyncHandler");




exports.getLastAccaunts = asyncHandler(async (req, res, next) => {
     const last_accounts=await  LastAccaunt.findAll()
    res.status(200).json({ success: true, data: last_accounts });
});
exports.newLastAccaunt = asyncHandler(async (req, res, next) => {
    const user = await LastAccaunt.create({
        ...req.body
    });
    res.status(200).json({ success: true, data: user });
});
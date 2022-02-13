const { Op } = require("sequelize");
const { ForDirect } = require("../db/sequelize");
const asyncHandler = require("../middlewares/asyncHandler");

exports.getForDirectUsers = asyncHandler(async (req, res, next) => {
    const users = await ForDirect.findAll()
    res.status(200).json({ success: true, data: users });
});
exports.newForDirectUser = asyncHandler(async (req, res, next) => {
    const user = await ForDirect.create({
        ...req.body
    });
    res.status(200).json({ success: true, data: user });
});
exports.findOrCreateForDirectUser = asyncHandler(async (req, res, next) => {
    const user = await ForDirect.findOrCreate({
        where: { ...req.body }
    });
    res.status(200).json({ success: true, data: user });
});
exports.findUser=asyncHandler(async (req,res,next)=>{
    const user=await ForDirect.findOne({where:{
            pk:req.body.id
        }})
    res.status(200).json({ success: true, data: user });
})
exports.deleteUser=asyncHandler(async (req,res,next)=>{
    const user=await ForDirect.destroy({where:{
            pk:req.body.pk
        }})
    res.status(200).json({ success: true, data: user });
})
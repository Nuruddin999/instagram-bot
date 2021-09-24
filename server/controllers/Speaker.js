const { Op } = require("sequelize");
const {  Speaker} = require("../db/sequelize");
const asyncHandler = require("../middlewares/asyncHandler");



exports.newUser = asyncHandler(async (req, res, next) => {
    const user = await Speaker.create({
        ...req.body
    });
    res.status(200).json({ success: true, data: user });
});
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users=await  Speaker.findAll()
    res.status(200).json({ success: true, data: users });
});
exports.newUser = asyncHandler(async (req, res, next) => {
    const user = await Speaker.findOrCreate({
        where:{   ...req.body}
    });
    res.status(200).json({ success: true, data: user});
});
exports.findSpeaker=asyncHandler(async (req,res,next)=>{
    const user=await Speaker.findOne({where:{
            pk:req.body.id
        }})
    res.status(200).json({ success: true, data: user });
})
exports.deleteSpeaker=asyncHandler(async (req,res,next)=>{
    const user=await Speaker.destroy({where:{
            pk:req.body.pk
        }})
    res.status(200).json({ success: true, data: user });
})
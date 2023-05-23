const express =require("express");
const UserModel = require("../models/userModel");
const searchRoute = express.Router();

searchRoute.get("/:username",async(req,res)=>{
    const username = req.params.username;
    const users = await UserModel.find().or([{name:{$regex:username,$options:"i"}},{username:{$regex:username,$options:"i"}}]).limit(10)
    let foundUsers = users.map(user=>{
        if(user.username != req.user.username) return {name:user.name,username:user.username};})
    res.status(200).send(foundUsers)
})

module.exports = searchRoute;
const express = require("express")
const bcrypt = require("bcrypt")
const UserModel = require("../models/userModel")
const loginRoute = express.Router();
const getAccessToken =  require("../utils/getAccessToken")
const getResfreshToken = require("../utils/getRefreshToken")

loginRoute.post('/',async (req,res)=>{
    const {email,password} = req.body;
    let isMatch;
    const user = await UserModel.findOne({$or: [{email:email},{username:email}]})
    if(!user){
        res.status(404).send({message:"User not found"})
        return
    }

    try{
        isMatch = await bcrypt.compare(password,user.password)
    }
    catch(err){
        console.log("\nPassword comparison failed"  + err);
    }

    if(!isMatch){
        res.status(401).send({message:"Invalid credentials"})
        return
    }
    const refreshToken = getResfreshToken({email:user.email});

    res.cookie("refreshToken",refreshToken,{httpOnly:true,expires:new Date(Date.now()+7*24*60*60*1000),sameSite: 'none',secure:true,domain:process.env.COOKIE_DOMAIN || undefined})

    user.refreshToken = refreshToken;
    try{
        await user.save();
    }catch(err){
        console.log(err)
    }

    res.send({message:"Login successful",user:{name:user.name,username:user.username,email:user.email,accessToken:getAccessToken({email:user.email})}})
});




module.exports = loginRoute;
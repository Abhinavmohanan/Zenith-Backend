const express = require("express")
const refreshRoute = express.Router()
const jwt = require("jsonwebtoken")
const UserModel = require("../models/userModel")
const getRefreshToken = require("../utils/getRefreshToken")
const getAccessToken = require("../utils/getAccessToken")


refreshRoute.post('/',async (req,res)=>{
    let refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        res.status(404).send({message:"Refresh Token not found"})
        return;
    }

    let userInfo;
    try{
        userInfo = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
    }
    catch(err){
        console.log("Error" + err)
        if(err.name == "TokenExpiredError"){
            const userInfo = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,{ignoreExpiration:true});
            const user = await UserModel.findOne({email:userInfo.email})
            user.refreshToken = null 
            res.cookie("refreshToken","", {httpOnly:true,expires:new Date(0)})
            await user.save();
            res.status(401).send({message:"Refresh Token Expired , Logging out"})
            return;
        }
    }
    const user = await UserModel.findOne({email:userInfo.email})
    if(!user){
        res.status(404).send({message:"User not found"})
        return;
    }
    if(user.refreshToken != refreshToken){
        user.refreshToken = null  //Refresh token reuse check
        res.cookie("refreshToken","", {httpOnly:true,expires:new Date(0)})
        await user.save();
        res.status(401).send({message:"Invalid Refresh Token , Logging out"})
        return;
    }

    refreshToken = getRefreshToken({email:user.email});

    user.refreshToken = refreshToken
    await user.save();

    res.cookie("refreshToken",refreshToken,{httpOnly:true,expires:new Date(Date.now()+7*24*60*60*1000)})
    res.send({message:"Refresh successful",user:{username:user.username,email:user.email,accessToken:getAccessToken({email:user.email})}})
})


module.exports = refreshRoute
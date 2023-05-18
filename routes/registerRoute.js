const express = require("express");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt")
const registerRoute = express.Router();


registerRoute.post('/',async(req,res)=>{
    const {name,username,email,password} = req.body;
    let hashedPassword;

    let user = await UserModel.findOne({username:username});

    if(user){
        res.status(409).send({message:`User with username ${user.username} already exist`,errorType:"username"})
        return
    }
    user = await UserModel.findOne({email:email})
    if(user){
        res.status(409).send({message:`User with email ${user.email} already exist`,errorType:"email"})
        return
    }

    try{
        hashedPassword  = await bcrypt.hash(password,10)
    }catch(err){
        console.log("Failed to hash" + err)
    }
    user = UserModel({
        name:name,
        username:username,
        email:email,
        password:hashedPassword
    })

    user.save().then((result)=>{
        res.send({message:"User Registered Successfully",data:{username:result.username}})
    }).catch((err)=>{
        res.status(500).send({message:"Failed to register user",error:err})
    })
});




module.exports = registerRoute;
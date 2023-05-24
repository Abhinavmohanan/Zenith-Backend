const express = require("express");
const logoutRoute = express.Router();

logoutRoute.post('/',async(req,res)=>{
    const user = req.user;  //user is attached from authHandler middleware
    user.refreshToken = null
    try{
        await user.save()
        res.cookie("refreshToken","", {httpOnly:true,expires:new Date(0),sameSite:'none',secure:true,domain:process.env.FRONT_END_URL})
        res.status(200).send({message:"Logout Successful"})
    }
    catch(err){
        console.log("Failed to logout" + err)
        res.status(404).send({message:"Failed to logout"})
    }
})

module.exports = logoutRoute;
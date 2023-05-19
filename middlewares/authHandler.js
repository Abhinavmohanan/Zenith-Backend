const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken")

const authHandler = async(req,res,next)=>{ //This middleware is used to check if the user is logged in or not and attach user if logged in
    const accessToken = req.headers.authorization?.split(" ")[1];

    if(!accessToken){
        res.status(404).send({message:"Access Token not found"})
        return;
    }

    let user 

    try{
        user = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    }
    catch(err){
        console.log("Error" + err)
        if(err.name == "TokenExpiredError"){
            res.status(401).send({message:"Access Token Expired"})
            return;
        }
    }

    req.user = await UserModel.findOne({email:user.email});
    if(!req.user.refreshToken){
        res.status(401).send({message:"User not logged in"});
        return
    }
    if(!req.user){
        res.status(404).send({message:"User not found"}) //This will never happen as the access token is verified
        return;
    }

    next();
}

module.exports = authHandler;
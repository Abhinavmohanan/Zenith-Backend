const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken")

const socketAuth = async(socket,next)=>{
    const accessToken = socket.handshake.auth.accessToken;
    let err;

    if(!accessToken){
        err = new Error("Socket Error Access Token not found");
        next(err);
        return;
    }

    let user 

    try{
        user = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    }
    catch(err){
        console.log("Socket Error  " + err + accessToken)
        if(err.name == "TokenExpiredError"){
            err = new Error("Access Token Expired");
            err.data = {refresh:true};
            next(err);
            return;
        }
        return;
    }

    socket.user = await UserModel.findOne({email:user.email});
    if(!socket.user.refreshToken){
        err = new Error("Socket Error User not logged in");
        next(err);
        return
    }
    if(!socket.user){
        err = new Error("Socket Error User not found");
        next(err); //This will never happen as the access token is verified
        return;
    }


    next()
}

module.exports = socketAuth;
const jwt = require("jsonwebtoken");

module.exports = (payload)=>{
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '15m'})
}
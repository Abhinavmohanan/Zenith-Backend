const jwt = require("jsonwebtoken");

module.exports = (payload)=>{
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn: '7d'})
}
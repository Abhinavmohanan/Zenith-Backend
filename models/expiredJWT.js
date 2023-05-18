const mongoose = require("mongoose")

const expiredJWTSchema = mongoose.Schema({
    token:{type:String,
            required:true}
})

module.exports = mongoose.model("expiredJWT",expiredJWTSchema);
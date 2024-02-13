const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: { 
        type: String ,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true,
    },
    refreshToken:{
        type:String,
    },
    rooms:{
        type:[{roomoid:String,
            roomid:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Rooms"
            }//Array of room ids
            }], 
    }
})

module.exports = mongoose.model("User",userSchema);
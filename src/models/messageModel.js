const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
    message:{type:String,required:true},
    sender:{type:String,required:true}, //username
    receiver:{type:String},//username
    date:{type:Date,required:true},
    roomid:{type:mongoose.Schema.Types.ObjectId,ref:"Rooms",required:true},
})

module.exports = mongoose.model("Messages",messageSchema)
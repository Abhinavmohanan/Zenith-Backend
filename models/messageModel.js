const mongoose = require("mongoose");


const messageSchema = mongoose.Schema({
    message:{type:String,required:true},
    sender:{type:String,required:true}, //username
    receiver:{type:String,required:true},//username
    date:{type:Date,required:true}
})

module.exports = mongoose.model("Messages",messageSchema)
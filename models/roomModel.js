const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
    type: {type:String,required:true},
    id: {type:String,required:true},
    name: {type:String},
    users: {type:[String],required:true}, //Array of user ids
})


module.exports = mongoose.model("Rooms",roomSchema); 
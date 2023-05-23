const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
    type: {type:String,required:true,enum:["private","privateGroup","publicGroup"]},
    id: {type:String,required:true},
    name: {type:String},
    messages:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Messages",
    },
    users: {
        type:[{
            name:String,
            username: String,
        }],
        required:true
    }
        , //Array of user ids
})


module.exports = mongoose.model("Rooms",roomSchema); 
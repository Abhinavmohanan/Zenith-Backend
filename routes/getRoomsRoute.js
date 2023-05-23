const express = require("express");
const UserModel = require("../models/userModel");
const getRoomsRoute = express.Router();

getRoomsRoute.get("/",async(req,res)=>{
    let user = req.user;
    user = await user.populate('rooms.roomid')
    const {rooms} = await user.populate('rooms.roomid.messages')
    const sendRooms = rooms.map((room)=>{
        let users = [];
        if(room.roomid.users){
            users = room.roomid.users.map((user)=>{
                return {name:user.name,username:user.username}
            })
        }
        const toUser = users.filter((user)=>{return user.username != req.user.username})[0]
        return {_id:room.roomid._id,id:room.roomoid,name:room.roomid.name,type:room.roomid.type,to:toUser,messages:room.roomid.messages}
    })
    res.status(200).send(sendRooms)
})
module.exports = getRoomsRoute;



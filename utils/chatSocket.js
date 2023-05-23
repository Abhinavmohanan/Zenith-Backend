const socketAuth = require("../middlewares/socketAuthHandler")
const crypto = require("crypto");

getUniqueId = ()=>{
    return crypto.randomBytes(16).toString("hex");
}


const chatSocket = (server)=>{
    const userModel = require("../models/userModel");
    const roomModel = require("../models/roomModel");
    const messageModel = require("../models/messageModel");

    const io = require('socket.io')(server,{
        cors :{
            origin:process.env.FRONT_END_URL,
        }
    })

    const userIo = io.of("/chat")

    userIo.use(socketAuth)


    userIo.on('connection',(socket)=>{
        console.log(socket.user.username +  " Joined Socket " + socket.id);

        socket.on('disconnect',()=>{
            console.log(socket.user.username +  " Left Socket " + socket.id);
        })

        socket.on('addRoom',async (to,addRoom)=>{
            let newRoom,user2,exisitingRoom,id;
            const user1 = socket.user;
            console.log("Adding Room")

            try{
                user2 = await userModel.findOne({username:to.username})
            }
            catch(err){
                console.log(err)
                return
            }
            try{
                exisitingRoom = await roomModel.findOne({type:"private","users.username":{$all : [user1.username,to.username]}}) 
                console.log("Exisiting room " + exisitingRoom)
            }
            catch(err){ 
                console.log(err)
                return
            }
            if(exisitingRoom){
                socket.join(exisitingRoom.id)
                console.log("Room exists")
                console.log("Joined Room " + exisitingRoom.id);
                addRoom({_id:exisitingRoom._id,id:exisitingRoom.id,type:"private",to:{name:user2.name,username:user2.username}},true)
                return
            }
            try{
                id = getUniqueId()
                newRoom = roomModel({type:"private",users:[{name:user1.name,username:user1.username},{name:user2.name,username:user2.username}],id:id})
            }
            catch(err){
                console.log("Room Creation Error" + err)
                return
            }
            try{
                await newRoom.save();
                socket.join(newRoom.id)
            }
            catch(err){
                console.log(err)
                return
            }

            try{
                user1.rooms.push({roomoid:newRoom.id,roomid:newRoom._id})
                user2.rooms.push({roomoid:newRoom.id,roomid:newRoom._id})

                await user1.save()
                await user2.save()

                addRoom({_id:newRoom._id,id:id,type:"private",to:{name:user2.name,username:user2.username}})
            }
            catch(err){
                console.log(err)
                return
            }

            console.log("Joined Room " + newRoom.id);
        })

        socket.on('joinRoom',(room)=>{
            console.log("Joining Rooms")
            try{
                socket.join(room)
            }
            catch(err){
                console.log("Error Joining Room" + err)
            }

            console.log("Joined Rooms :");
            console.log(socket.rooms)
        })

        socket.on('sendMessage',async (roomid,message)=>{
            const user = socket.user;
            const room = await roomModel.findOne({id:roomid})
            message.roomid = room._id
            const newMessage = messageModel(message)
            try{
                await newMessage.save()
                room.messages.push(newMessage._id)
                await room.save()
                socket.to(roomid).emit('recieveMessage',message)
            }
            catch(err){
                console.log(err)
            }
            console.log("Message Sent")
        })

    })

    userIo.on('disconnect',(socket)=>{
        console.log(socket.user.username +  " Left Socket " + socket.id);
    })

}

module.exports = chatSocket;
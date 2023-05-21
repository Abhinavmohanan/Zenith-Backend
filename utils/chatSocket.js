const { socketAuth } = require("../middlewares/authHandler");
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
            origin:"http://localhost:3000",
        }
    })

    const userIo = io.of("/chat")

    userIo.use(socketAuth)


    userIo.on('connection',(socket)=>{
        console.log(socket.user.username +  " Joined Socket " + socket.id);

        socket.on('disconnect',()=>{
            console.log(socket.user.username +  " Left Socket " + socket.id);
        })

        socket.on('joinRoom',async (to,cb)=>{
            let newRoom,user2,exisitingRoom;
            const user1 = socket.user;


            try{
                user2 = await userModel.findOne({username:to.username})
            }
            catch(err){
                console.log(err)
                return
            }
            try{
                exisitingRoom = await roomModel.findOne({type:"private",users:{$all : [user1.username,to.username]}}) 
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
                return
            }
            try{
                const id = getUniqueId()
                newRoom = roomModel({type:"private",users:[user1.username,user2.username],id:id})
            }
            catch(err){
                console.log(err)
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
            }
            catch(err){
                console.log(err)
                return
            }

            console.log("Joined Room " + newRoom.id);

            cb("Joined Room " + newRoom.id)
        })
    })

    userIo.on('disconnect',(socket)=>{
        console.log(socket.user.username +  " Left Socket " + socket.id);
    })

}

module.exports = chatSocket;
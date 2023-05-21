
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true,origin:"http://localhost:3000"})) //This will enable CORS

//Middlewares
const authHandler = require('./middlewares/authHandler').authHandler;

//Routes
const loginRoute = require('./routes/loginRoute');
const registerRoute = require('./routes/registerRoute');
const refreshRoute = require('./routes/refreshRoute');
const logoutRoute = require('./routes/logoutRoute');
const searchRoute = require('./routes/searchRoute');



//Chat Socket
require('./utils/chatSocket')(server)


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log("Connect to MongoDB Succesfully")
    }).catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
    });



app.use('/login',loginRoute);

app.use('/register',registerRoute);

app.use('/refreshToken',refreshRoute); 

// Protected Routes

app.use(authHandler) //This middleware will run before every route below it

app.use('/searchUsers',searchRoute)

app.use('/logout',logoutRoute);
        
server.listen(4000, () => {
    console.log('Server is running on port 4000');
});

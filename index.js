
const express = require('express');
const app = express();
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(cookieParser())

//Routes
const loginRoute = require('./routes/loginRoute');
const registerRoute = require('./routes/registerRoute');
const refreshRoute = require('./routes/refreshRoute');
const logoutRoute = require('./routes/logoutRoute');


//Middlewares
const authHandler = require('./middlewares/authHandler');


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

app.use('/logout',logoutRoute);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

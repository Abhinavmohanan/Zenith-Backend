
const express = require('express');
const app = express();
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose");

app.use(express.json())

//Routes
const loginRoute = require('./routes/loginRoute');
const registerRoute = require('./routes/registerRoute');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log("Connect to MongoDB Succesfully")
    }).catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
    });

app.use('/login',loginRoute);

app.use('/register',registerRoute);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

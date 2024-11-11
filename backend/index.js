/*
Task List - Backend

Jyotiprakash Sahoo: jpsahoo3@gmail.com

Main file from where execution starts
*/
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/connectDb.js";
import router from "./routes/routers.js";
import cors from "cors";
import passport from "passport";
import session from 'express-session';

//For using Dot env files
dotenv.config();
const port = process.env.PORT;
const DATABASE_URL = "mongodb://localhost:27017/"

const app = express();

//JSON middleware (For reading data from payload present in json format)
app.use(express.json());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(cors())


//Task List Routers
app.use("/", router);

//Database connection for Task List
connectDB(DATABASE_URL);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
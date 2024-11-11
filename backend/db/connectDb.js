/*
Task List - Backend

Jyotiprakash Sahoo: jpsahoo3@gmail.com

Database connection function
*/

import mongoose from "mongoose";
mongoose.connection.setMaxListeners(150);

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: process.env.DB_NAME,
    };
    await mongoose.connect(DATABASE_URL, DB_OPTIONS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected Succesfully...");
  } catch (error) {
    console.error(error);
  }
};
export default connectDB;

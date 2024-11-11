/*
Task List - Backend

Jyotiprakash Sahoo: jpsahoo3@gmail.com

Contains User Schema and implemented Model using this Schema

*/

import { Schema, mongoose } from "mongoose";

const UserSchema = new Schema({
    name :{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        required: function() {
            // Only require password if googleId is not set
            return !this.googleId;
        }
    },
    date : {
        type : Date,
        default : Date.now
    },
    googleId: { // Field to store Google ID for OAuth
        type: String,
        unique: true,
        sparse: true // Allows for multiple users without a Google ID
    }
});


// Define the Customer model
export const User = mongoose.model('user', UserSchema);

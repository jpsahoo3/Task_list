/*
Task List - Backend

Jyotiprakash Sahoo: jpsahoo3@gmail.com

Contains Task Schema and implemented Model using this Schema

*/
import { Schema, mongoose } from "mongoose";
import {User} from "./User.js"

const TaskSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User
    },
    title :{
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    tag : {
        type : String,
        default : "General"
    },
    date : {
        type : Date,
        default : Date.now
    }
});

export const Task = mongoose.model('notes', TaskSchema);
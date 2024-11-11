/*
Task List - Backend

Jyotiprakash Sahoo: jpsahoo3@gmail.com

Router file from where endpoints are being routed to apis
*/
import express from "express";
import { taskDelete, taskGet, taskGetByGoogleId, taskPost, taskPut } from "../apis/taskApi.js";
import fetchuser from "../middleware/fetchUser.js";
import { createUser, getUser, loginUser } from "../apis/authApi.js";
import dotenv from 'dotenv'
import { googleLogin, googleLoginCallBack } from "../apis/googleLogin.js";

dotenv.config();
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello from Task List")
})

router.post("/createuser", createUser)
router.post("/loginuser", loginUser)
router.use("/getuser", fetchuser)
router.post("/getuser",getUser)

router.use("/task", fetchuser);
router.use("/taskbygoogle", fetchuser)

router.get("/task", taskGet);
router.get("/taskbygoogle", taskGetByGoogleId);
router.post("/task", taskPost);
router.put("/task/:id", taskPut);
router.delete("/task/:id", taskDelete);


router.get("/auth/google/",googleLogin);
router.get("/auth/google/callback",googleLoginCallBack);

export default router;
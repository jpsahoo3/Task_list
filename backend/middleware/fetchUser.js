/*
Task List - Backend

Jyotiprakash Sahoo: jpsahoo3@gmail.com

Contains middleware for verifying token

*/
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    //Get the user from the jwt token and add id to request object
    const token = req.header('auth-token');

    if (!token) {
        const googleId = req.user.googleId;
        if (!googleId) {
            return res.status(401).send({
                error: true,
                msg: "Please authenticate using a valid token",
                data: null,
            });
        } else {
            req.user = req.user;
            next();
        }
        return res.status(401).send({
            error: true,
            msg: "Please authenticate using a valid token",
            data: null,
        });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({
            error: true,
            msg: "Please authenticate using a valid token",
            data: null,
        })
    }
}

export default fetchuser;
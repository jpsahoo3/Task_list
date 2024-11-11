/*
Task List - Backend

Jyotiprakash Sahoo: jpsahoo3@gmail.com

Contains User related apis

*/
import { GET_ERROR_MESSAGE_ON_EXCEPTION } from "../utility/utils.js"
import { User } from "../models/User.js"
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const createUser = async (req, res) => {

    // Validate request body using express-validator
    await Promise.all([
        body('name', "Enter a valid name").isLength({ min: 3 }).run(req),
        body('email', "Enter a valid email").isEmail().run(req),
        // body('password', "Password must be at least 5 characters").isLength({ min: 5 }).run(req),
    ]);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            error: true,
            msg: "Validation Error",
            data: errors.array()
        })
    }

    // Check if user already exists
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).send({
                error: true,
                msg: "Sorry, a user with this email already exists.",
                data: null,
            });
        }


        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });

        const data = {
            user: {
                id: user.id
            }
        };

        const authtoken = jwt.sign(data, JWT_SECRET);
        // success = true;
        // res.json({ success, authtoken });
        return res.status(200).send({
            error: false,
            msg: "auth-token",
            data: authtoken
        })
    } catch (error) {
        return GET_ERROR_MESSAGE_ON_EXCEPTION(error);
    }
};


const loginUser = async (req, res) => {

    // Validate request body using express-validator
    await Promise.all([
        body('email', "Enter a valid email").isEmail().run(req),
        // body('password', "Password cannot be blank").exists().run(req),
    ]);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            error: true,
            msg: "Validation Error",
            data: errors.array()
        })
    }

    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({
                error: true,
                msg: "Please try to login with correct credentials.",
                data: null
            })
        }

        // Compare entered password with stored hashed password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).send({
                error: true,
                msg: "Please try to login with correct credentials.",
                data: null
            });
        }

        // Create JWT token
        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT_SECRET);

        return res.status(200).send({
            error: false,
            msg: "Login Success",
            data: authtoken
        })
    } catch (error) {
        return GET_ERROR_MESSAGE_ON_EXCEPTION(error)
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the request object
        const user = await User.findById(userId).select("-password"); // Fetch user details excluding the password
        // Handle case where user is not found
        if (!user) {
            return res.status(404).send({
                error: true,
                msg: "User not found",
                data: null
            });
        }
        // Send the user details as a response
        return res.status(200).send({
            error: false,
            msg: "User Data",
            data: user
        });
    } catch (error) {
        return GET_ERROR_MESSAGE_ON_EXCEPTION(error)
    }
};

export {
    createUser,
    loginUser,
    getUser
}
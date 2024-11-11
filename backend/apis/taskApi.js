/*
Task List - Backend

Jyotiprakash Sahoo: jpsahoo3@gmail.com

Contains Task related apis

*/
import { GET_ERROR_MESSAGE_ON_EXCEPTION } from "../utility/utils.js"
import { Task } from "../models/task.js"
import { validationResult } from 'express-validator';

const taskGet = async (req, res) => {
    try {
        // Fetch notes associated with the authenticated user
        const notes = await Task.find({ user: req.user.id });
        // Send the notes as a JSON response
        return res.status(200).send({
            error: false,
            msg: "Note",
            data: notes
        })
    } catch (error) {
        return GET_ERROR_MESSAGE_ON_EXCEPTION(error)
    }
}
const taskGetByGoogleId = async (req, res) => {
    try {
        // Fetch notes associated with the authenticated user
        const notes = await Task.find({ googleId: req.user.googleId });
        // Send the notes as a JSON response
        return res.status(200).send({
            error: false,
            msg: "Note",
            data: notes
        })
    } catch (error) {
        return GET_ERROR_MESSAGE_ON_EXCEPTION(error)
    }
}

const taskPost = async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: true,
                msg: "Validation Error",
                data: errors.array()
            })
        }

        // Create a new note
        const note = new Task({
            title,
            description,
            tag,
            user: req.user.id, // Associate the note with the authenticated user
        });

        const savedNote = await note.save(); // Save the note to the database
        // Send the saved note as a JSON response
        return res.status(200).send({
            error: false,
            msg: "Note",
            data: savedNote
        })

    } catch (error) {
        return GET_ERROR_MESSAGE_ON_EXCEPTION(error)
    }
}

const taskPut = async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        // Create a new Note Object with updated fields
        const newNote = {};
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        // Find the note to be updated
        let note = await Task.findById(req.params.id);
        if (!note) {
            return res.status(400).send({
                error: true,
                msg: "Note Not Found",
                data: null
            })
        }

        // Check if the user is authorized to update this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({
                error: true,
                msg: "Unauthorized Access/Not Allowed",
                data: null
            })
        }

        // Update the note with new values
        note = await Task.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        // Send the updated note as a JSON response
        return res.status(200).send({
            error: false,
            msg: "Note",
            data: note
        })

    } catch (error) {
        return GET_ERROR_MESSAGE_ON_EXCEPTION(error)
    }

}
const taskDelete = async (req, res) => {
    try {
        // Find the note to be deleted
        let note = await Task.findById(req.params.id);
        if (!note) {
            return res.status(404).send({
                error: true,
                msg:"Task not found to delete",
                data: null
            });
        }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({
                error: true,
                msg: "Unauthorized Access/Not Allowed",
                data: null
            });
        }

        // Delete the note
        note = await Task.findByIdAndDelete(req.params.id);
        return res.status(200).send({ 
            error: false, 
            mesg: "Note has been deleted", 
            data: note 
        });

    } catch (error) {
        return GET_ERROR_MESSAGE_ON_EXCEPTION(error)
    }
}


export {
    taskGet,
    taskPut,
    taskPost,
    taskDelete,
    taskGetByGoogleId
}

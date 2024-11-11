import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:8000"
  const notesInitial = [ ]
  const [notes, setNotes] = useState(notesInitial);

  //GET all Notes
  const getNotes = async () => {
    //API Call
    const response = await fetch(`${host}/task`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });
    const json = await response.json();
    setNotes(json.data);
  }

  //ADD a Note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/task/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });
    const note = await response.json();
    setNotes(notes.concat(note.data));
  }

  //DELETE a Note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/task/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });
    const json = await response.json();
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes);
  }

  //EDIT a Note
  const editNote = async (id, title, description, tag) => {
    //API Call
    const response = await fetch(`${host}/task/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });
    const json = await response.json();
    let newNotes = JSON.parse(JSON.stringify(notes))
    //Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;
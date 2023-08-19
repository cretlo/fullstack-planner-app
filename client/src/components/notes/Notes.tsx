import { useState, useEffect } from "react";
import { Note as NoteType } from "../../types";
import Note from "./Note";
//import axios from "axios";
import { useAxiosContext } from "../../contexts/AxiosContext";

// interface Props {
//   initialNotes: NoteType[];
// }

const Notes = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [isNewNote, setIsNewNote] = useState(false);
  const { customAxios } = useAxiosContext();
  const newNote: NoteType = {
    id: -1,
    title: "Untitled",
    note: "",
    editorState: "",
  };

  useEffect(() => {
    customAxios
      .get("api/notes")
      .then((res) => {
        setNotes(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  async function addNote(newNote: NoteType) {
    try {
      const result = await customAxios.post("api/notes", newNote);
      setNotes([...notes, result.data]);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteNote(id: number) {
    try {
      const result = await customAxios.delete(`api/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== result.data.id));
    } catch (err) {
      console.error(err);
    }
  }

  async function updateNote(newNote: NoteType) {
    try {
      const result = await customAxios.put(`api/notes/${newNote.id}`, newNote);
      setNotes(
        notes.map((note) =>
          note.id === result.data.id ? result.data.id : note,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <h2 className="mb-3">Notes</h2>
      <div
        className="position-relative overflow-scroll bg-warning"
        style={{ maxHeight: "80vh" }}
      >
        <div className="list-group">
          <button
            className="list-group-item active sticky-top"
            onClick={() => setIsNewNote(true)}
          >
            Create Note
          </button>
          <div>
            {notes.map((note) => {
              return (
                <Note
                  key={note.id}
                  isNewNote={false}
                  initialNote={note}
                  updateNote={updateNote}
                  addNote={addNote}
                  deleteNote={deleteNote}
                />
              );
            })}
            {isNewNote && (
              <Note
                initialNote={newNote}
                isNewNote={isNewNote}
                updateNote={addNote}
                addNote={addNote}
                deleteNote={deleteNote}
                handleNewNote={setIsNewNote}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notes;

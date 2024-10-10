import NotesAPI from "./notesAPI.js"
import NotesView from "./NotesView.js";


const app = document.getElementById("app");
const view = new NotesView(app, {
    onNoteAdd(){
        console.log("Let's Create some Note!");
    },
    onNoteSelect(id){
        console.log("Note Selected!" + id);
    },
    onNoteDelete(id){
        console.log("Note Deleted!" + id);
    },
    onNoteEdit(newTitle, newBody){
        console.log(newTitle);
        console.log(newBody);
    }
});

const notes = NotesAPI.getAllNotes();


view.updateNoteList(notes);
view.updateActiveNote(notes[0]);
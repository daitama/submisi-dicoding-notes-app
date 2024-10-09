import NotesAPI from "./notesAPI.js"
import NotesView from "./NotesView.js";


const app = document.getElementById("app");
const view = new NotesView(app, {
    onNoteAdd(){
        console.log("Let's Create some Note!");
    }
});
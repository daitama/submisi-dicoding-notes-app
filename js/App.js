import NotesView from "./NotesView.js";
import NotesAPI from "./notesAPI.js";

export default class App {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this.#handlers());  

        this.#refreshNotes();
    }

    #refreshNotes() {
        const notes = NotesAPI.getAllNotes();

        this.#setNotes(notes);

        if(notes.length > 0){
            this.#setActiveNote(notes[0]);
        }
    }

    #setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    #setActiveNote(note){
        this.activeNote = note;
        this.view.updateActiveNote(note); 
    }

    #handlers(){
        return { 
            onNoteSelect: id =>{
                console.log("Note Selected!" + id);
                const selectedNote = this.notes.find(note => note.id == id);
                this.#setActiveNote(selectedNote);
            },
            onNoteAdd: ()=>{
                console.log("Let's Create some Note!");
                const newNotes = {
                    title: "New Note",
                    body: "Take Note..."
                };
                NotesAPI.saveNotes(newNotes);
                this.#refreshNotes();
            },
            onNoteEdit:(newTitle, newBody) =>{
                NotesAPI.saveNotes({
                    id: this.activeNote.id,
                    title: newTitle,
                    body: newBody
                });

                this.#refreshNotes();
            },
            onNoteDelete:(id) => {
                NotesAPI.deleteNotes(id);
                this.#refreshNotes();
            }
        };
    }
}
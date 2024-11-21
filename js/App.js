import NotesView from "./NotesView.js";
import NotesAPI from "./notesAPI.js";

export default class App {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this.#handlers());  

        this.#refreshNotes();
    }

    async #refreshNotes() {
        const notes = await NotesAPI.getAllNotes();

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
            onNoteAdd: async ()=>{
                console.log("Let's Create some Note!");
                const newNotes = {
                    title: "New Note",
                    body: "Take Note..."
                };
                await NotesAPI.saveNotes(newNotes);
                this.#refreshNotes();
            },
            onNoteEdit: async (newTitle, newBody) =>{
                await NotesAPI.saveNotes({
                    id: this.activeNote.id,
                    title: newTitle,
                    body: newBody
                });

                this.#refreshNotes();
            },
            onNoteDelete: async (id) => {
                await NotesAPI.deleteNotes(id);
                this.#refreshNotes();
            }
        };
    }
}
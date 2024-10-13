import { notesData } from "./notes.js";

export default class NotesAPI {
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || JSON.stringify(notesData));
        console.log(notes);

        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }
    static saveNotes(noteToSave){
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);

        // Edit/Add mechanism
        if(existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        }else {
            noteToSave.id = NotesAPI.#generateId();
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }
        
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }
    static deleteNotes(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);
        
        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }
    static #generateId() {
        const prefix = "notes-";
    
        // Function to generate random alphanumeric string of given length
        function randomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }
    
        // Create ID parts with the desired format
        const randomPart1 = randomString(2);   // Example: 'jT'
        const randomPart2 = randomString(16);  // Example: 'jjsyz61J8XKiI'
        
        return `${prefix}${randomPart1}-${randomPart2}`;
    }
}
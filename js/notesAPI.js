import { notesData } from "../data/notes.js";

const baseURL = 'https://notes-api.dicoding.dev/v2';

export default class NotesAPI {
    static async getAllNotes() {
        try{
            const response = await fetch(`${baseURL}/notes`);

            if(!response.ok){
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const responseJson = await response.json();

            if(responseJson.status !== 'success'){
                throw new Error(`API Error: ${responseJson.message}`);
            }
            
            const notes = responseJson.data;
            console.log(notes);


            return notes.sort((a, b) => {
                return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
            });
        }
        catch(error){
            console.error(error);
            return [];
        }

    }
    static async saveNotes(noteToSave){
        try{
            const notes = await NotesAPI.getAllNotes();
            const existing = notes.find(note => note.id == noteToSave.id);
            if(existing) {
                existing.title = noteToSave.title;
                existing.body = noteToSave.body;
                existing.createdAt = new Date().toISOString();
                await this.deleteNotes(noteToSave.id);
                console.log(existing);

                const response = await fetch(`${baseURL}/notes`,{
                    method : "POST",
                    headers: {"Content-Type": "application/json"},
                    body : JSON.stringify({title: existing.title, body: existing.body}),
                });

                if(!response.ok) {
                    throw new Error (`Failed to Save note: ${response.statusText}`);
                }
            }else{
                const response = await fetch(`${baseURL}/notes`,{
                    method : "POST",
                    headers: {"Content-Type": "application/json"},
                    body : JSON.stringify(noteToSave),
                });

                if(!response.ok) {
                    throw new Error (`Failed to Save note: ${response.statusText}`);
                }
                console.log("Notes Created!");
            }
        }
        catch(error){
            console.error(error);
        }
    }
    static async deleteNotes(id) {
        try{
            const response = await fetch(`${baseURL}/notes/${id}`,{
                method: "DELETE",
            });

            if(!response.ok) {
                throw new Error(`Failed to delete note: ${response.status}`);
            }
            const updatedNotes = await NotesAPI.getAllNotes();
            console.log(updatedNotes);
        }
        catch (error) {
            console.error(`Error Deleting Notes: ${error}`);
        }
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
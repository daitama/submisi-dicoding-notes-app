import "./customElement/noteListItem.js"

export default class NotesView {
  constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
        <div class="notes__sidebar">
        <add-btn></add-btn>
        <div id="loading" style ="display: none;">
          Loading...
        </div>
        <div class="notes__list"></div>
    </div>
    <div class="notes__preview">
      <note-bar style ="  
              display: flex;
              flex-direction: column;
              padding: 2em 3em;
              flex-grow: 1;">
      </note-bar>
    </div>
        `;

    const noteBar = this.root.querySelector("note-bar");
    const btnAddNote = this.root.querySelector("add-btn").shadowRoot.querySelector(".notes__add");
    const inpTitle = noteBar.shadowRoot.querySelector(".notes__title");
    const inpBody = noteBar.shadowRoot.querySelector(".notes__body");

    btnAddNote.addEventListener("click", () => {
      this.onNoteAdd();
    });

    [inpTitle, inpBody].forEach((inputField) => {
      inputField.addEventListener("blur", () => {
        const updatedTitle = inpTitle.value.trim();
        const updatedBody = inpBody.value.trim();

        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });

    //TODO: hide the note preview by default
    this.updateNotePreviewVisibility(false);
  }

  #createListItemHTML(id, title, body, updated) {
    const MAX_BODY_LENGTH = 60;
    const MAX_TITLE_LENGTH = 25;

    return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small_title-container">
                  <div class="notes__small-title">
                  ${title.substring(0, MAX_TITLE_LENGTH)}
                  ${title.length > MAX_TITLE_LENGTH ? "..." : ""}
                  </div>
                  <button class="notes__delete" type="button">X</button>
                </div>
                <div class="notes__small-body">
                ${body.substring(0, MAX_BODY_LENGTH)}
                ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>        
        `;
  }

  updateNoteList(notes) {
    const notesListContainer = this.root.querySelector(".notes__list");
  
    // Empty the list container
    notesListContainer.innerHTML = "";
  
    for (const note of notes) {
      // Create a new <note-list-item> element
      const noteItem = document.createElement('note-list-item');
      
      // Set the note data for the component
      noteItem.setNoteData(note.id, note.title, note.body, new Date(note.createdAt));
  
      // Listen for custom events from the note item
      noteItem.addEventListener('select-note', (e) => {
        this.onNoteSelect(e.detail);
      });
  
      noteItem.addEventListener('delete-note', (e) => {
          this.onNoteDelete(e.detail);
      });
  
      // Append the component to the notes list container
      notesListContainer.appendChild(noteItem);
    }
  }
  

  updateActiveNote(note){
    this.root.querySelector("note-bar").shadowRoot.querySelector(".notes__title").value = note.title;
    this.root.querySelector("note-bar").shadowRoot.querySelector(".notes__body").value = note.body;
    this.activeNote = this.root.querySelector(`note-list-item[data-note-id="${note.id}"]`);

    this.root.querySelectorAll("note-list-item").forEach(noteListItem => {
      noteListItem.shadowRoot.querySelector(".notes__list-item").classList.remove("notes__list-item--selected");
      noteListItem.shadowRoot.querySelector(".notes__delete").style.visibility = "hidden";
    });

    // Mark the active note as selected
    this.activeNote.shadowRoot.querySelector(".notes__list-item").classList.add("notes__list-item--selected");

    // Show the delete button for the active note
    this.activeNote.shadowRoot.querySelector(".notes__delete").style.visibility = "visible";
  }

  updateNotePreviewVisibility(visible){
    this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
  }
}

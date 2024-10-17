export default class NotesView {
  constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
        <div class="notes__sidebar">
        <button class="notes__add" type="button">Add Note</button>
        <div class="notes__list"></div>
    </div>
    <div class="notes__preview">
        <input type="text" class="notes__title" placeholder="New Note...">
        <textarea name="notes-body" id="" class="notes__body">Take Note...</textarea>
    </div>
        `;

    const btnAddNote = this.root.querySelector(".notes__add");
    const inpTitle = this.root.querySelector(".notes__title");
    const inpBody = this.root.querySelector(".notes__body");

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

    //Empty List
    notesListContainer.innerHTML = "";

    for(const note of notes) {
        const html = this.#createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

        notesListContainer.insertAdjacentHTML("beforeend", html);
    }

    //Add Select/delete event for each list item
    notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
        noteListItem.addEventListener("click", () => {
            this.onNoteSelect(noteListItem.dataset.noteId);
        });

        noteListItem.querySelector(".notes__delete").addEventListener("click", (event) => {
          event.stopPropagation();
          const doDelete = confirm("Are You Sure you want to delete this note?");

          if(doDelete) {
              this.onNoteDelete(noteListItem.dataset.noteId);
          }
        });
    });
  }

  updateActiveNote(note){
    this.root.querySelector(".notes__title").value = note.title;
    this.root.querySelector(".notes__body").value = note.body;
    this.activeNote = this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`);

    this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
        noteListItem.classList.remove("notes__list-item--selected");
    });

    this.root.querySelectorAll(".notes__delete").forEach(deleteButton => {
        deleteButton.style.visibility = "hidden";
    });

    this.activeNote.classList.add("notes__list-item--selected");
    this.activeNote.querySelector(".notes__delete").style.visibility = "visible";
  }

  updateNotePreviewVisibility(visible){
    this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
  }
}

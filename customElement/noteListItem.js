class NoteListItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../css/styled.css">
        <div class="notes__list-item notes__list-item--selected">
        <div class="notes__small_title-container">
             <div class="notes__small-title">Lecture Notes</div>
            <button class="notes__delete" type="button">X</button>
        </div>
        <div class="notes__small-body"></div>
        <div class="notes__small-updated"></div>
        </div>
      `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector(".notes__delete").addEventListener("click", (event) => {
      event.stopPropagation();
      const doDelete = confirm("Are You Sure you want to delete this note?");
      if (doDelete) {
        this.dispatchEvent(new CustomEvent("delete-note", { detail: this.dataset.noteId }));
      }
    });

    this.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("select-note", { detail: this.dataset.noteId }));
    });
  }

  setNoteData(id, title, body, updated) {
    this.dataset.noteId = id;
    this.shadowRoot.querySelector(".notes__small-title").textContent = title.length > 25 ? title.substring(0, 25) + "..." : title;
    this.shadowRoot.querySelector(".notes__small-body").textContent = body.length > 60 ? body.substring(0, 60) + "..." : body;
    this.shadowRoot.querySelector(".notes__small-updated").textContent = updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });
  }
}

customElements.define("note-list-item", NoteListItem);

import styles from "./styles.js";

function loadStyles(shadow, css) {
  const style = document.createElement('style');
  style.textContent = css; // Ensure raw CSS string
  shadow.appendChild(style);
}

class NoteListItem extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <div class="notes__list-item notes__list-item--selected">
        <div class="notes__small_title-container">
          <div class="notes__small-title">Lecture Notes</div>
          <button class="notes__delete" type="button">X</button>
        </div>
        <div class="notes__small-body"></div>
        <div class="notes__small-updated"></div>
      </div>
    `;
    loadStyles(shadow, styles);
  }

  connectedCallback() {
    this.shadowRoot.querySelector(".notes__delete").addEventListener("click", this.handleDelete);
    this.addEventListener("click", this.handleSelect);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector(".notes__delete").removeEventListener("click", this.handleDelete);
    this.removeEventListener("click", this.handleSelect);
  }

  handleDelete = (event) => {
    event.stopPropagation();
    const doDelete = confirm("Are you sure you want to delete this note?");
    if (doDelete) {
      this.dispatchEvent(new CustomEvent("delete-note", { detail: this.dataset.noteId }));
    }
  };

  handleSelect = () => {
    this.dispatchEvent(new CustomEvent("select-note", { detail: this.dataset.noteId }));
  };

  setNoteData(id, title = "", body = "", updated = new Date()) {
    this.dataset.noteId = id;
    this.shadowRoot.querySelector(".notes__small-title").textContent = title.length > 25 ? title.substring(0, 25) + "..." : title;
    this.shadowRoot.querySelector(".notes__small-body").textContent = body.length > 60 ? body.substring(0, 60) + "..." : body;
    this.shadowRoot.querySelector(".notes__small-updated").textContent = new Date(updated).toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "short",
    });
  }
}

class NoteBar extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <input type="text" class="notes__title" placeholder="New Note...">
      <textarea name="notes-body" class="notes__body">Take Note...</textarea>
    `;
    loadStyles(shadow, styles);
  }
}

class AddButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <button class="notes__add" type="button">Add Note</button>
    `;
    loadStyles(shadow, styles);
  }
}

customElements.define("note-list-item", NoteListItem);
customElements.define("note-bar", NoteBar);
customElements.define("add-btn", AddButton);

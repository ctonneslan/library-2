const myLibrary = [];

class Book {
  constructor(title, author, image, read) {
    this.title = title;
    this.author = author;
    this.image = image;
    this.read = read;
    this.id = crypto.randomUUID();
  }

  toggleRead() {
    this.read = !this.read;
  }
}

function addBookToLibrary(title, author, image, read) {
  let book = new Book(title, author, image, read);
  myLibrary.push(book);
}

function removeBookById(id) {
  const index = myLibrary.findIndex((book) => book.id === id);
  if (index !== -1) {
    myLibrary.splice(index, 1);
    displayLibrary();
  }
}

function displayLibrary() {
  const readContainer = document.querySelector(".main-left .cards");
  const wishListContainer = document.querySelector(".main-right .cards");

  readContainer.innerHTML = "";
  wishListContainer.innerHTML = "";

  myLibrary.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("book-card");
    card.dataset.id = book.id;

    if (book.image) {
      const img = document.createElement("img");
      img.src = book.image;
      img.alt = `${book.title} cover`;
      img.classList.add("book-image");
      card.appendChild(img);
    }

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = `by ${book.author}`;

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = book.read ? "Mark as Unread" : "Mark as Read";
    toggleBtn.addEventListener("click", () => {
      book.toggleRead();
      displayLibrary();
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      removeBookById(book.id);
    });

    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(toggleBtn);
    card.appendChild(removeBtn);

    if (book.read) {
      readContainer.appendChild(card);
    } else {
      wishListContainer.appendChild(card);
    }
  });
}

const modalOverlay = document.getElementById("modalOverlay");
const modal = document.getElementById("modal");
const openBtn = document.querySelector(".open-modal-btn");
const closeBtn = document.getElementById("closeBtn");
const form = document.getElementById("bookForm");

openBtn.addEventListener("click", () => {
  modalOverlay.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = "none";
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modalOverlay.style.display = "none";
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const status = data.get("status");
  const read = status === "read";

  const imageFile = data.get("image");
  let imageURL = null;

  if (imageFile && imageFile.size > 0) {
    imageURL = URL.createObjectURL(imageFile);
  }

  addBookToLibrary(data.get("title"), data.get("author"), imageURL, read);
  displayLibrary();

  modalOverlay.style.display = "none";
  form.reset();
});

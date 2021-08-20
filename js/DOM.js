let BOOKS_ITEMID = "itemId";

let toggleForm = document.querySelector("#toggleForm");

toggleForm.addEventListener("click", function () {
  let inputGroup = document.querySelectorAll(".inputForm");

  for (const input of inputGroup) {
    if (input.disabled == true) {
      input.disabled = false;
      toggleForm.innerText = "Disable";
    } else {
      input.disabled = true;
      toggleForm.innerText = "Enable";
    }
  }
});

function setBooks(Element) {
  let titleBooks = Element.querySelector("#titleBooks").value;
  let authorBooks = Element.querySelector("#authorBooks").value;
  let yearBooks = Element.querySelector("#yearBooks").value;
  let checkboxBooks = Element.querySelector("#checkboxBooks").checked;
  let books = createBooks(titleBooks, authorBooks, yearBooks, checkboxBooks);

  let obj = composeBooksObj(titleBooks, authorBooks, yearBooks, checkboxBooks);
  books[BOOKS_ITEMID] = Bookshelf.id;

  Bookshelf.push(obj);

  updateDataToStorage();
}

function createCheckButton() {
  return createButton("Selesai Baca", function (event) {
    addBooksToCompleted(event.target.parentElement);
  });
}

function createUndoButton() {
  return createButton("Belum Selesai", function (event) {
    undoBooksFromCompleted(event.target.parentElement);
  });
}

function createEditButton() {
  return createButton("Edit Data", function (event) {
    editData(event.target.parentElement);
  });
}

function createTrashButton() {
  return createButton("Hapus Buku", function (event) {
    removeBooksFromCompleted(event.target.parentElement);
  });
}

function createButton(buttonTypeClass, eventListener) {
  const button = document.createElement("button");
  button.innerHTML = buttonTypeClass;
  button.addEventListener("click", function (event) {
    eventListener(event);
    event.stopPropagation();
  });
  return button;
}

function addBooksToCompleted(booksElement) {
  const titleBooks = booksElement.querySelector(".items > h4").innerText;
  const authorBooks = booksElement.querySelector(".items > .author").innerText;
  const yearBooks = booksElement.querySelector(".items > .year").innerText;

  const book = findBooks(booksElement[BOOKS_ITEMID]);
  book.checkboxBooks = true;

  booksElement.remove();
  window.alert("Buku Selesai Dibaca!");

  const newBooks = createBooks(titleBooks, authorBooks, yearBooks, true);
  newBooks[BOOKS_ITEMID] = book.id;
  booksElement.append(newBooks);
  updateDataToStorage();
  window.location.reload();
}
function editData(booksElement) {
  const titleBooks = booksElement.querySelector(".items > h4");
  titleBooks.remove();
  const authorBooks = booksElement.querySelector(".items > .author");
  authorBooks.remove();
  const yearBooks = booksElement.querySelector(".items > .year");
  yearBooks.remove();
  const allButton = booksElement.querySelectorAll("button");
  for (const button of allButton) {
    button.remove();
  }

  let inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.placeholder = "Judul Buku";
  inputTitle.id = "titleBooks";

  let inputAuthor = document.createElement("input");
  inputAuthor.type = "text";
  inputAuthor.placeholder = "Penulis Buku";
  inputAuthor.id = "authorBooks";

  let inputYear = document.createElement("input");
  inputYear.type = "number";
  inputYear.placeholder = "Tahun Terbit";
  inputYear.id = "yearBooks";

  let labelCheck = document.createElement("label");
  labelCheck.innerHTML = "Selesai Dibaca";
  labelCheck.setAttribute("for", "check");

  let inputCheckbox = document.createElement("input");
  inputCheckbox.type = "checkbox";
  inputCheckbox.name = "check";
  inputCheckbox.id = "checkboxBooks";
  labelCheck.append(inputCheckbox);

  let buttonConfirmEdit = document.createElement("button");
  buttonConfirmEdit.id = "buttonConfirmEdit";
  buttonConfirmEdit.innerText = "Edit";

  buttonConfirmEdit.addEventListener("click", function (event) {
    const target = event.target.parentElement;
    event.preventDefault();
    setBooks(target);

    const booksPosition = findBooksIndex(target[BOOKS_ITEMID]);
    Bookshelf.splice(booksPosition, 1);

    booksElement.remove();
    updateDataToStorage();
    window.alert("Buku Diedit");

    window.location.reload();
  });

  booksElement.append(
    inputTitle,
    inputAuthor,
    inputYear,
    labelCheck,
    buttonConfirmEdit
  );
}

function removeBooksFromCompleted(booksElement) {
  const booksPosition = findBooksIndex(booksElement[BOOKS_ITEMID]);
  Bookshelf.splice(booksPosition, 1);

  booksElement.remove();
  updateDataToStorage();
  window.alert("Buku Dihapus");
  window.location.reload();
}

function undoBooksFromCompleted(booksElement) {
  const titleBooks = booksElement.querySelector(".items > h4").innerText;
  const authorBooks = booksElement.querySelector(".items > .author").innerText;
  const yearBooks = booksElement.querySelector(".items > .year").innerText;

  const newBooks = createBooks(titleBooks, authorBooks, yearBooks, true);

  const books = findBooks(booksElement[BOOKS_ITEMID]);
  books.checkboxBooks = false;
  newBooks[BOOKS_ITEMID] = books.id;

  booksElement.append(newBooks);
  booksElement.remove();

  updateDataToStorage();
  window.alert("Buku Dipindahkan ke Rak Belum dibaca");
  window.location.reload();
}

function createBooks(titleBooks, authorBooks, yearBooks, status) {
  let title = document.createElement("h4");
  title.classList.add("title");
  title.innerHTML = titleBooks;

  let spTitle = document.createElement("span");
  spTitle.innerText = "Judul";
  title.append(spTitle);

  let author = document.createElement("p");
  author.classList.add("author");
  author.innerHTML = authorBooks;

  let spAuthor = document.createElement("span");
  spAuthor.innerText = "Penulis Buku";
  author.append(spAuthor);

  let year = document.createElement("p");
  year.classList.add("year");
  year.innerHTML = yearBooks;

  spYear = document.createElement("span");
  spYear.innerText = "Tahun Terbit";
  year.append(spYear);

  const itemContainer = document.createElement("div");
  itemContainer.classList.add("card", "items", "hidden");
  itemContainer.append(title, author, year);

  if (status) {
    itemContainer.append(
      createUndoButton(),
      createEditButton(),
      createTrashButton()
    );
  } else {
    itemContainer.append(
      createCheckButton(),
      createEditButton(),
      createTrashButton()
    );
  }

  return itemContainer;
}

let checkDataUncompleted = document.getElementById("btnUn");
checkDataUncompleted.addEventListener("click", function (event) {
  let target = event.target;
  target.innerText = "Edit Data";
  target.classList.add("editUncomplete");
  target.removeAttribute("id");
  let unImportant = document.querySelector("#belum object");
  unImportant.remove();
  target.remove();
  let itemContainer = document.querySelectorAll("#belum .items");
  for (const items of itemContainer) {
    items.classList.remove("hidden");
  }
});

let checkDataCompleted = document.getElementById("btnCom");
checkDataCompleted.addEventListener("click", function (event) {
  let target = event.target;
  target.innerText = "Edit Data";
  target.classList.add("editComplete");
  target.removeAttribute("id");
  let unImportant = document.querySelector("#sudah object");
  unImportant.remove();
  target.remove();
  let itemContainer = document.querySelectorAll("#sudah .items");
  for (const items of itemContainer) {
    items.classList.remove("hidden");
  }
});

function refreshDataFromBooks() {
  let listUncompleted = document.getElementById("belum");
  let listCompleted = document.getElementById("sudah");

  for (book of Bookshelf) {
    let newBooks = createBooks(
      book.titleBooks,
      book.authorBooks,
      book.yearBooks,
      book.checkboxBooks
    );
    newBooks[BOOKS_ITEMID] = book.id;

    if (book.checkboxBooks) {
      listCompleted.append(newBooks);
    } else {
      listUncompleted.append(newBooks);
    }
  }
}

const searchConfirm = document.getElementById("searchConfirm");
searchConfirm.addEventListener("click", function (event) {
  const target = event.target;
  const formSearch = target.parentElement.querySelector(".formSearch");

  formSearch.classList.remove("hidden");

  target.remove();
});

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function (event) {
  searchDisplay();
  const target = event.target;
  let searchKeys = target.parentElement.querySelector("#inputSearch").value;
  searchData = document.querySelectorAll(".items");
  for (const data of searchData) {
    if (data.innerText.includes(searchKeys)) {
      data.classList.remove("hidden");
    }
  }
});

function searchDisplay() {
  listUn = document.getElementById("belum");
  listCom = document.getElementById("sudah");
  for (book of Bookshelf) {
    let newBooks = createBooks(
      book.titleBooks,
      book.authorBooks,
      book.yearBooks,
      book.checkboxBooks
    );
    newBooks[BOOKS_ITEMID] = book.id;

    let status = document.createElement("h3");
    if (book.checkboxBooks) {
      status.innerHTML = "Selesai Dibaca";
      newBooks.append(status);
      let displayContainer = document.getElementById("searchContainer");
      displayContainer.append(newBooks);
      console.log(displayContainer);
    } else {
      status.innerHTML = "Belum Selesai Dibaca";
      newBooks.append(status);
      let displayContainer = document.getElementById("searchContainer");
      displayContainer.append(newBooks);
      console.log(displayContainer);
    }
  }

  listCom.remove();
  listUn.remove();
}

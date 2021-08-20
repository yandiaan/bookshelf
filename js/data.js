const STORAGE_KEY = "Bookshelf";

let Bookshelf = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Local Storage Terdeteksi");
    return false;
  }
  return true;
}

function composeBooksObj(titleBooks, authorBooks, yearBooks, checkboxBooks) {
  return {
    id: +new Date(),
    titleBooks,
    authorBooks,
    yearBooks,
    checkboxBooks,
  };
}

function saveData() {
  const parsed = JSON.stringify(Bookshelf);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    Bookshelf = data;
  }
  document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
  if (isStorageExist()) {
    saveData();
  }
}

function findBooks(booksId) {
  for (books of Bookshelf) {
    if (books.id === booksId) return books;
  }

  return null;
}

function findBooksIndex(booksId) {
  let index = 0;
  for (books of Bookshelf) {
    if (books.id === booksId) return index;

    index++;
  }

  return -1;
}

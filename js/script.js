document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    setBooks(event.target.parentElement);
    window.location.reload();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
});

//Book class:

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: handle UI Tasks
class UI {
  //so we don't have instantiate the UI
  static displayBooks() {
    //   this was the initial books I had
    // const StoredBooks = [
    //   {
    //     title: "John Johnny",
    //     author: "David",
    //     isbn: 3434434,
    //   },
    //   {
    //     title: "Sam",
    //     author: "Dav",
    //     isbn: 45545,
    //   },
    // ];
    // const books = StoredBooks;

    const books = Store.getBooks();

    //looping and calling the method with passing the book
    books.forEach((book) => UI.addBookToList(book));
  } // end displayBook

  //create the row of the book
  static addBookToList(book) {
    //get the ids
    const list = document.querySelector("#book-list");

    //create a dom element
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

    //append the row to the list
    list.appendChild(row);
  }

  static deleteBook(el) {
    //make sure it has the delete class
    if (el.classList.contains("delete")) {
      //this will remove the <tr>
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    //build the alert here
    const div = document.createElement("div");
    div.className = `alert rounded-pill text-center alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    //insert the div before the form
    container.insertBefore(div, form);

    //disappear in 3 sec
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    //get the values and clear it
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

//Store Class: handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      // have to have it as a string (can't take array)
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Event to display book
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event to add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  //Prevent the default submit
  e.preventDefault();
  //Get the form values by targeting their ids
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //Validation
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    //Instantiate book
    const book = new Book(title, author, isbn);
    // console.log(book);

    // Add book to UI
    UI.addBookToList(book);

    //Add book to Store
    Store.addBook(book);

    //show success message
    UI.showAlert("Book Added", "success");

    //clear the fields after submission
    UI.clearFields();
  }
});

//Event to remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
    //Remove book from UI
  UI.deleteBook(e.target);

  //Remove book from Storage
  //target the isbn which is the parameter that the function receives
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show success message
  UI.showAlert("Book Removed", "warning");
});

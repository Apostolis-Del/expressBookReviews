const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    const userExists = Object.values(users).some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Add new user to the users object
    const userId = Object.keys(users).length + 1;
    users[userId] = { username, password };

    return res.status(200).json({ message: "User successfully registered" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).json({ books: JSON.stringify(books, null, 2) });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn];

    if (book) {
        res.status(200).json({ book });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const authorBooks = [];

    // Iterate through the books object to find books with matching author
    for (const isbn in books) {
        if (books.hasOwnProperty(isbn)) {
            const book = books[isbn];
            if (book.author.toLowerCase() === author.toLowerCase()) {
                authorBooks.push({ isbn, ...book });
            }
        }
    }

    if (authorBooks.length > 0) {
        res.status(200).json({ authorBooks });
    } else {
        res.status(404).json({ message: "Books by this author not found" });
    }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const titleBooks = [];

    // Iterate through the books object to find books with matching title
    for (const isbn in books) {
        if (books.hasOwnProperty(isbn)) {
            const book = books[isbn];
            if (book.title.toLowerCase() === title.toLowerCase()) {
                titleBooks.push({ isbn, ...book });
            }
        }
    }

    if (titleBooks.length > 0) {
        res.status(200).json({ titleBooks });
    } else {
        res.status(404).json({ message: "Books with this title not found" });
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn];

    if (book) {
        const reviews = book.reviews;
        res.status(200).json({ reviews });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;

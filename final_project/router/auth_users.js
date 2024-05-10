// const express = require('express');
// const jwt = require('jsonwebtoken');
// let books = require("./booksdb.js");
// const regd_users = express.Router();

// let users = [];

// const isValid = (username)=>{ //returns boolean
// //write code to check is the username is valid
// }

// const authenticatedUser = (username,password)=>{ //returns boolean
// //write code to check if username and password match the one we have in records.
// }

// //only registered users can login
// regd_users.post("/login", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// module.exports.authenticated = regd_users;
// module.exports.isValid = isValid;
// module.exports.users = users;
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    "username":"del",
    "password":"del"
}];

const isValid = (username) => {
    // Check if username is valid (e.g., not empty)
    return username.trim().length > 0;
}

const authenticatedUser = (username, password) => {
    // Check if username and password match the ones we have in records
    const user = users.find(user => user.username === username && user.password === password);
    return !!user;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    console.log(req.body,"---------------TO REQUEST-------------------")
    const username = req.body.username;
    const password = req.body.password;

    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    return res.status(200).json({ accessToken });
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    const review = req.query.review;
    console.log(req,"to authorization")
    const username = req.session.authorization ? req.session.authorization.username : null;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already posted a review for the specified ISBN
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        // If the user has already posted a review, modify the existing review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review modified successfully" });
    } else {
        // If the user has not posted a review yet, add a new review
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added successfully" });
    }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    const username = req.session.authorization ? req.session.authorization.username : null;

    // Check if username is present in session
    // if (!username) {
    //     return res.status(401).json({ message: "User not logged in" });
    // }

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has posted a review for the specified ISBN
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        // If the user has posted a review, delete it
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        // If the user has not posted a review for the specified ISBN
        return res.status(404).json({ message: "Review not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;



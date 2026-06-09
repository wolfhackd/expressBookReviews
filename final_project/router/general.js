const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({message: "Username already exists"});
  }
  users.push({username, password});
  return res.status(200).json({message: "User created successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({books: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(200).json({book: book});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorBooks = Object.values(books).filter((book) => book.author.toLocaleLowerCase().includes(req.params.author.toLocaleLowerCase()) );
  if (authorBooks.length === 0) {
    return res.status(404).json({message: "Books not found"});
  }
  return res.status(200).json({books: authorBooks});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleBooks = Object.values(books).filter((book) => book.title.toLocaleLowerCase().includes(req.params.title.toLocaleLowerCase()));
  if (titleBooks.length === 0) {
    return res.status(404).json({message: "Books not found"});
  }
  return res.status(200).json({books: titleBooks});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  if (!book.reviews) {
    return res.status(404).json({message: "Reviews not found"});
  }
  return res.status(200).json({reviews: book.reviews});
});

module.exports.general = public_users;

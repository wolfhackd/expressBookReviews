const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
if(username.length < 0 || username === undefined){
  return false;
}
if(users.filter((user) => user.username === username).length > 0){
  return false;
}
return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
if(users.filter((user) => user.username === username && user.password === password).length > 0){
  return true;
}
return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (authenticatedUser(username, password)) {

    const token = jwt.sign({ username }, 'access', { expiresIn: '1h' });
    req.session.authorization = {
      accessToken: token,
      username: username
    };
    return res.status(200).json({message: "User logged in successfully", token: token});
  }
  return res.status(401).json({message: "Invalid username or password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { username, review } = req.body;
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  if (!book.reviews) {
    book.reviews = {};
  }
  book.reviews[username] = review;
  return res.status(200).json({message: "Review added successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { username } = req.body;
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  if (!book.reviews) {
    book.reviews = {};
  }
  delete book.reviews[username];
  return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

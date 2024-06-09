const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  try {
    res.status(200).send({
      status: true,
      data: books,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbnParam = req.params.isbn;
  try {
    const response = books[parseInt(isbnParam)];
    res.status(200).send({
      status: true,
      data: response,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  try {
    const authorParam = req.params.author.toString();
    const bookKeys = Object.keys(books);
    const bookResult = [];
    bookKeys.forEach((key) => {
      if (books[key].author === authorParam) {
        bookResult.push(books[key]);
      }
    })
    if (bookResult.length > 0) {
      res.status(200).send({
        status: true,
        data: bookResult,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Author is undefined",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;

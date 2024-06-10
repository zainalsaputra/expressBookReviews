const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  try {
    const usernameBody = req.body.username;
    const passwordBody = req.body.password;
    if (!usernameBody || !passwordBody) {
      return res.status(404).send({
        status: false,
        message: "Username or Password cannot be empty"
      })
    }

    if (isValid(usernameBody)) {
      return res.status(404).send({
        status: false,
        message: `Username ${usernameBody} is already!!`
      })
    }
    const result = users.push({ "username": usernameBody, "password": passwordBody, });
    if (!result) {
      return res.status(404).send({
        status: false,
        message: "Account registered failed!!"
      })
    }
    return res.status(201).send({
      status: true,
      message: `Account with username ${usernameBody} has been created!!`
    })
  } catch (error) {
    return res.status(404).send({
      status: false,
      message: error.message
    })
  }
});

public_users.get('/cek', (req, res) => { return res.send(users) });

// Get the boolready!! in the shop
public_users.get('/', function (req, res) {
  try {
    return res.status(200).send({
      status: true,
      data: books,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: error.message,
    });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbnParam = req.params.isbn;
  try {
    const response = books[parseInt(isbnParam)];
    return res.status(200).send({
      status: true,
      data: response,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: error.message,
    });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  try {
    const authorParam = req.params.author.toString();
    const bookKeys = Object.keys(books);
    const bookResult = [];
    bookKeys.forEach((key) => {
      if (books[key].author.includes(authorParam)) {
        bookResult.push(books[key]);
      }
    })
    if (bookResult.length > 0) {
      return res.status(200).send({
        status: true,
        data: bookResult,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Author is undefined",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: error.message,
    });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  try {
    const titleParam = req.params.title.toString();
    const bookKeys = Object.keys(books);
    const bookResult = [];
    bookKeys.forEach((key) => {
      if (books[key].title.includes(titleParam)) {
        bookResult.push(books[key]);
      }
    })
    if (bookResult.length > 0) {
      return res.status(200).send({
        status: true,
        data: bookResult,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Title is undefined",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: error.message,
    });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbnParam = req.params.isbn;
  try {
    const response = books[parseInt(isbnParam)];
    return res.status(200).send({
      status: true,
      reviews: response.reviews,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports.general = public_users;

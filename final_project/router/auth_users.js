const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  const isUserPresent = users.some(obj => Object.values(obj).includes(username));
  return isUserPresent;
}

const authenticatedUser = (username, password) => { //returns boolean
  const user = users.find((user) => user.username === username && user.password === password);
  return !!user;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  try {
    const usernameBody = req.body.username;
    const passwordBody = req.body.password;
    if (!usernameBody || !passwordBody) {
      return res.status(404).send({
        status: false,
        message: "Username or Password cannot be empty"
      })
    }
    if (authenticatedUser(usernameBody, passwordBody) === false) {
      return res.status(401).send({
        status: false,
        message: `Username or password is incorrect!!`
      })
    }

    const user = users.find((user) => user.username === usernameBody);
    console.log(isValid(usernameBody));
    if (!user) {
      return res.status(401).send({ status: false, message: "User not found." });
    }

    const accessToken = jwt.sign({ username: user.username }, 'its_mY-secReT-KeY');
    req.session.accessToken = accessToken;

    return res.status(200).send({
      status: true,
      message: `Login are successfully!!`,
      accessToken
    })

  } catch (error) {
    return res.status(200).send({
      status: false,
      message: error.message
    })
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const reviewBody = req.body.reviews;
  const { isbn } = req.params;
  const username = req.user.username;

  try {
    if (!reviewBody) {
      return res.status(400).send({ status: false, message: "Review is required" });
    }

    if (!username) {
      return res.status(401).send({ status: false, message: "Unauthorized" });
    }

    if (!books[isbn]) {
      return res.status(404).send({ status: false, message: "Book not found" });
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = reviewBody;

    return res.status(200).send({ status: true, message: "Review added/modified successfully" });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message
    })
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  try {
    if (!username) {
      return res.status(401).send({ status: false, message: "Unauthorized" });
    }

    if (!isValid(username)) {
      return res.status(401).send({ status: false, message: "Invalid username" });
    }

    if (!books[isbn]) {
      return res.status(400).send({ status: false, message: "Invalid ISBN" });
    }

    if (!books[isbn].reviews[username]) {
      return res.status(400).send({ status: false, message: "Review not found for the given ISBN and username" });
    }

    delete books[isbn].reviews[username];
    return res.status(200).send({ status: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message
    })
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

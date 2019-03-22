const uuid = require("uuid/v4");
const Sequelize = require("sequelize");
const express = require("express");
const router = express.Router();
const { Book, Author } = require("../models");
const { books: oldBooks } = require("../data/db.json");

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.sendStatus(403);
  } else {
    if (authorization === "Bearer my-awesome-token") {
      next();
    } else {
      res.sendStatus(403);
    }
  }
};

router
  .route("/")
  .get(async (req, res) => {
    const { author, title } = req.query;

    if (title) {
      const books = await Book.findAll({
        where: { title: title }, //match based on title
        include: [Author] //different from line 34 because Author and title belongs to different tables
      });
      res.json(books);
    } else if (author) {
      const books = await Book.findAll({
        include: [{ model: Author, where: { name: author } }] //to include Author name, and match based on name (where)
      });
      res.json(books);
    } else {
      const books = await Book.findAll({ include: [Author] }); //to include Author name
      res.json(books);
    }
  })
  .post(verifyToken, (req, res) => {
    const book = req.body;
    book.id = uuid();
    res.status(201).json(req.body);
  });

router
  .route("/:id")
  .put((req, res) => {
    const book = oldBooks.find(b => b.id === req.params.id);
    if (book) {
      res.status(202).json(req.body);
    } else {
      res.sendStatus(400);
    }
  })
  .delete((req, res) => {
    const book = oldBooks.find(b => b.id === req.params.id);
    if (book) {
      res.sendStatus(202);
    } else {
      res.sendStatus(400);
    }
  });

module.exports = router;

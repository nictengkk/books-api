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
    try {
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
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(400);
    }
  })
  .post(verifyToken, async (req, res) => {
    try {
      const { title, author } = req.body;
      const foundAuthor = await Author.findOne({ where: { name: author } });

      if (!foundAuthor) {
        const createdBook = await Book.create(
          { title, author: { name: author } },
          { include: [Author] }
        );
        return res.status(201).json(createdBook);
      }
      const createdBook = await Book.create(
        { title, authorId: foundAuthor.id },
        { include: [Author] }
      );
      return res.status(201).json(createdBook);

      // const { title, author } = req.body;
      // const [foundAuthor] = await Author.findOrCreate({
      //   where: {
      //     name: author
      //   }
      // });
      // const newBook = await Book.create({ title: title });
      // await newBook.setAuthor(foundAuthor);
      // const newBookWithAuthor = await Book.findOne({
      //   where: { id: newBook.id },
      //   include: [Author]
      // });
      // res.status(201).json(newBookWithAuthor);
    } catch (error) {
      console.error(error.message);
      return res.status(400);
    }
  });

router
  .route("/:id")
  .put(async (req, res) => {
    try {
      const book = await Book.findOne({
        where: { id: req.params.id },
        include: [Author]
      });
      const [foundAuthor] = await Author.findOrCreate({
        where: { name: req.body.author }
      });

      await book.update({ title: req.body.title });
      await book.setAuthor(foundAuthor);
      const updatedBook = await Book.findOne({
        where: { id: book.id },
        include: [Author]
      });
      return res.status(202).json(updatedBook);
    } catch (error) {
      console.error(error.message);
      return res.status(400).end();
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

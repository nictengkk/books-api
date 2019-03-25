const Sequelize = require("sequelize");
const express = require("express");
const router = express.Router();
const { Book, Author, sequelize } = require("../models");
// const { books: oldBooks } = require("../data/db.json");

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
        res.json(books); //why dont need return??
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
      // const { title, author } = req.body;
      // const foundAuthor = await Author.findOne({ where: { name: author } });

      // if (!foundAuthor) {
      //   const createdBook = await Book.create(
      //     { title, author: { name: author } },
      //     { include: [Author] }
      //   );
      //   return res.status(201).json(createdBook);
      // }
      // const createdBook = await Book.create(
      //   { title, authorId: foundAuthor.id },
      //   { include: [Author] }
      // );
      // return res.status(201).json(createdBook);

      //Alternative using findOrCreate
      const { title, author } = req.body;
      await sequelize.transaction(async t => {
        const [foundAuthor] = await Author.findOrCreate({
          where: {
            name: author
          },
          transaction: t
        });
        const newBook = await Book.create({ title: title }, { transaction: t });
        await newBook.setAuthor(foundAuthor, { transaction: t });
        const newBookWithAuthor = await Book.findOne({
          where: { id: newBook.id },
          include: [Author],
          transaction: t
        });
        res.status(201).json(newBookWithAuthor);
      });
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
  .delete(async (req, res) => {
    try {
      const book = await Book.destroy({
        where: { id: req.params.id }
      });
      if (book) {
        return res.sendStatus(202);
      }
      return res.sendStatus(400);
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(400);
    }
  });

module.exports = router;

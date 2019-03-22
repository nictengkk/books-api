//somehow create books and authors here
const { Author, Book } = require("./models");

//books were not included in the orignial schema for Author, but because of the relationship assocation, it is included
const createAuthorAndBooks = async () => {
  await Author.create(
    {
      name: "George Orwell",
      books: [
        { title: "Animal Farm" },
        { title: "1984" },
        { title: "Homage to Catalonia" },
        { title: "The Road to Wigan Pier" }
      ]
    },
    { include: [Book] }
  );
  await Author.create(
    {
      name: "Aldous Huxley",
      books: [{ title: "Brave New World" }]
    },
    { include: [Book] }
  );
  await Author.create(
    {
      name: "Ray Bradbury",
      books: [{ title: "Fahrenheit 451" }]
    },
    { include: [Book] }
  );
};

module.exports = createAuthorAndBooks;

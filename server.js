const app = require("./app");
const { sequelize } = require("./models"); //...models was exported from index.js, hence they will import sequelize from that file instead.
const createAuthorAndBooks = require("./seed");

const port = process.env.PORT || 5555;

//wrap sequelize sync to create connection
//force: true -> each Model will delete table (clear database) each time it is run, which is not good for production.
sequelize.sync({ force: true }).then(() => {
  createAuthorAndBooks(); //populates the tables in the database
  app.listen(port, () => {
    if (process.env.NODE_ENV === "production") {
      console.log(`Server is running on Heroku with port number ${port}`);
    } else {
      console.log(`Server is running on http://localhost:${port}`);
    }
  });
});

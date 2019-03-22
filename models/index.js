const Sequelize = require("sequelize");
//create the preconfigured sequelize instance
const sequelize = new Sequelize("booksapi", "postgres", "", {
  dialect: "postgres",
  logging: false
});

//pass the models to the connection
const models = {
  Book: sequelize.import("./Book"),
  Author: sequelize.import("./Author")
};

Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

//Link up all models
module.exports = {
  sequelize,
  ...models
};

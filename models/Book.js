// const Sequelize = require("sequelize");

module.exports = (sequelize, type) => {
  const Book = sequelize.define(
    "book",
    {
      title: type.STRING,
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    },
    { timestamps: false }
  );

  //create association
  Book.associate = models => {
    Book.belongsTo(models.Author);
  };
  return Book;
};

// const Sequelize = require("sequelize");

module.exports = (sequelize, type) => {
  const Author = sequelize.define(
    "author",
    {
      name: type.STRING,
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    },
    { timestamps: false }
  );

  //create association
  Author.associate = models => {
    Author.hasMany(models.Book);
  };
  return Author;
};

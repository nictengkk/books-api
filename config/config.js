module.exports = {
  development: {
    username: "postgres",
    password: "",
    database: "booksapi",
    options: {
      dialect: "postgres"
    }
  },
  test: {
    username: "postgres",
    password: "",
    database: "booksapi",
    options: {
      dialect: "sqlite",
      storage: ":memory:",
      logging: false
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    options: {
      dialect: "postgres"
    }
  }
};

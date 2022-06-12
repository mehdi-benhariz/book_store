"use strict";

const models = require("../db");
const _USERS = require("./users.json");
const _BOOKS = require("./books.json");
// const User = require("../user");
const Book = require("../book");

module.exports = {
  insert: () => {
    console.log(models.user);
    models.User.bulkCreate(_USERS)
      .then(() => {
        models.Book.bulkCreate(_BOOKS);
      })
      .then((res) => console.log("success adding users and books"))
      .catch((err) => console.log(err));
  },
};

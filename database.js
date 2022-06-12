const Sequelize = require("sequelize");
const username = process.env.username;
const password = process.env.password;

exports.sequelize = new Sequelize("bookstore", username, password, {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: 0,
});
exports.init = () => {
  this.sequelize
    .sync({ force: false })
    .then(() => {
      console.log("Database & tables created!");
    })
    .catch((err) => console.log(err));
};

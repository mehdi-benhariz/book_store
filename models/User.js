const Sequelize = require("sequelize");
const { sequelize } = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = User = sequelize.define(
  "user",
  {
    // Column-1, user_id is an object with
    // properties like type, keys,
    // validation of column.
    user_id: {
      // Sequelize module has INTEGER Data_Type.
      type: Sequelize.INTEGER,
      // To increment user_id automatically.
      autoIncrement: true,
      // user_id can not be null.
      allowNull: false,
      // For uniquely identify user.
      primaryKey: true,
    },
    // Column-2, name
    username: { type: Sequelize.STRING, allowNull: false },
    // Column-3, email
    email: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    //user has many books
    //books belongs to user
    books: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
    },

    // Column-4, default values for
    // dates => current time
    myDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },

    // Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10, "a");
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10, "a");
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
    },
  }
);
User.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

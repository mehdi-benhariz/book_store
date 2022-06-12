module.exports = Book = sequelize.define("book", {
  book_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: Sequelize.STRING, allowNull: false },
  owner: { type: Sequelize.STRING, allowNull: true },
  isBorrowed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  // Timestamps
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("books", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    genre: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Book;
};

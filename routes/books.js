const express = require("express");
const router = express.Router();
const db = require('../models');
const Book = db["books"];
const adminMiddleware = require("../middleware/admin");

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

// define the main route
router.get("/", async (req, res) => {
  try {
    // Create a new book using the Book model
    const books = await Book.findAll();

    // Check if books exists
    if (!books) {
      return res.status(404).json({ error: "Books not found" });
    }

    // Respond with all books
    res.json(books);
  } catch (error) {
    // Handle any errors
    console.error("Error getting books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Example route to find a book by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Find a book by ID
    const book = await Book.findByPk(id);

    // Check if book exists
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Respond with the found book
    res.json(book);
  } catch (error) {
    // Handle any errors
    console.error("Error finding book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update route to update a book by ID
router.put("/:id", adminMiddleware, async (req, res) => {
  // Extract book ID from the request parameters
  const { id } = req.params;
  try {
    // Find the book by ID
    const book = await Book.findByPk(id);

    // Check if book exists
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Update the book's data with the data from the request body
    await Book.update(req.body, { where: { id: id } });

    // Fetch the updated book data from the database
    const updatedBook = await Book.findByPk(id);

    // Respond with the updated book data
    res.json(updatedBook);
  } catch (error) {
    // Handle any errors
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", adminMiddleware, async (req, res) => {
  const { title, year, genre, author } = req.body;
  try {
    // Create a new book using the Book model
    const newBook = await Book.create({
      title: title,
      year: year,
      genre: genre,
      author: author,
    });

    // Respond with the newly created book
    res.json(newBook);
  } catch (error) {
    // Handle any errors
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE route for deleting a user by ID
router.delete("/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    // Find the book by ID
    const book = await Book.findByPk(id);

    // If book not found, return 404 Not Found
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Delete the book
    await book.destroy();

    // Return success response
    return res.json({ message: "Book deleted successfully" });
  } catch (error) {
    // Handle any errors
    console.error("Error deleting book:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the book" });
  }
});

module.exports = router;

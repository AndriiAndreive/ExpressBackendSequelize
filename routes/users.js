const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db["users"];
const adminMiddleware = require('../middleware/admin');

// middleware that is specific to this router
router.use((req, res, next) => {
  next()
})
// define the home page route
router.get('/', async (req, res) => {
  try {
    // Create a new user using the User model
    const users = await User.findAll();

    // Check if users exists
    if (!users) {
      return res.status(404).json({ error: 'Users not found' });
    }

    // Respond with all users
    res.json(users);
  } catch (error) {
    // Handle any errors
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Example route to find a user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find a user by ID
    const user = await User.findByPk(id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the found user
    res.json(user);
  } catch (error) {
    // Handle any errors
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update route to update a user by ID
router.put('/:id', adminMiddleware, async (req, res) => {
  // Extract user ID from the request parameters
  const { id } = req.params;
  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update the user's data with the data from the request body
    await User.update(req.body, { where: { id: id } });

    // Fetch the updated user data from the database
    const updatedUser = await User.findByPk(id);

    // Respond with the updated user data
    res.json(updatedUser);
  } catch (error) {
    // Handle any errors
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', adminMiddleware, async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ where: { email: email }});
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using the User model
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      roleId: 2
    });

    // Respond with the newly created user
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    // Handle any errors
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE route for deleting a user by ID
router.delete('/:id', adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    // If user not found, return 404 Not Found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    await user.destroy();

    // Return success response
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    // Handle any errors
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
});

module.exports = router
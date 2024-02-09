const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db["users"];

// middleware that is specific to this router
router.use((req, res, next) => {
  next()
})
// define the home page route
router.get('/', (req, res) => {
  res.send('Book management system')
})

router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email: email }});

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token in response
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router
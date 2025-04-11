const userService = require('../services/userService');

// Sign up
const registerUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Log in
const loginUser = async (req, res) => {
  try {
    const token = await userService.authenticateUser(req.body);
    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id); // req.user is filled by authMiddleware
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Update income
const updateIncome = async (req, res) => {
  try {
    const updated = await userService.updateIncome(req.user.id, req.body.income);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add fixed expense
const addFixedExpense = async (req, res) => {
  try {
    const result = await userService.addFixedExpense(req.user.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Other controller functions...
// updateUserDetails
// deleteFixedExpense
// updateThemeColor
// updateCreditCardLimit
// etc.

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateIncome,
  addFixedExpense,
  // Add the rest as needed
};



// in useroutes.js:
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const auth = require('../middlewares/authMiddleware');

// router.post('/signup', userController.registerUser);
// router.post('/login', userController.loginUser);
// router.get('/me', auth, userController.getUserProfile);
// router.put('/income', auth, userController.updateIncome);
// router.post('/fixed-expense', auth, userController.addFixedExpense);

// module.exports = router;

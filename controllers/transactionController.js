const transactionService = require('../services/transactionService');

// Create a new transaction
const addTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.createTransaction(req.user.id, req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all transactions for the logged-in user
const getUserTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactionsByUser(req.user.id);
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter transactions by month & year
const getTransactionsByMonth = async (req, res) => {
  try {
    const { month, year } = req.query;
    const transactions = await transactionService.getTransactionsByMonth(req.user.id, month, year);
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optional: Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    await transactionService.deleteTransaction(req.user.id, req.params.id);
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optional: Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const updated = await transactionService.updateTransaction(req.user.id, req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  addTransaction,
  getUserTransactions,
  getTransactionsByMonth,
  deleteTransaction,
  updateTransaction,
};



// //transactionRoutes.js
// const express = require('express');
// const router = express.Router();
// const transactionController = require('../controllers/transactionController');
// const auth = require('../middlewares/authMiddleware');

// router.post('/', auth, transactionController.addTransaction);
// router.get('/', auth, transactionController.getUserTransactions);
// router.get('/month', auth, transactionController.getTransactionsByMonth);
// router.delete('/:id', auth, transactionController.deleteTransaction);
// router.put('/:id', auth, transactionController.updateTransaction);

// module.exports = router;



// // Transaction Schema (models/Transaction.js)
// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   amount: { type: Number, required: true },
//   category: { type: String, required: true },
//   type: { type: String, enum: ['fixed', 'variable'], default: 'variable' },
//   date: { type: Date, required: true },
//   paymentMethod: String,
//   note: String,
// }, { timestamps: true });

// module.exports = mongoose.model('Transaction', transactionSchema);

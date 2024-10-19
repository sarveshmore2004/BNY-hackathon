import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller.js';

const router = express.Router();

// Create a new transaction
router.post('/', verifyToken, createTransaction);

// Get all transactions
router.get('/', verifyToken, getTransactions);

// Update a transaction by ID
router.put('/:id', verifyToken, updateTransaction);

// Delete a transaction by ID
router.delete('/:id', verifyToken, deleteTransaction);

export default router;
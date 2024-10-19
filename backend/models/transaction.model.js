import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: String,
    required: true,
    match: /^\d{2}\/\d{2}\/\d{4}$/, // mm/dd/yyyy format
  },
  type: {
    type: String,  // 'credit' or 'debit'
    enum: ['credit', 'debit'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
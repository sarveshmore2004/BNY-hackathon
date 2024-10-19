import mongoose from 'mongoose';

const StatementSchema = new mongoose.Schema({
  transactions: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Transaction',  // Referencing the Transaction schema
    required: true,
  }],
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Representing accuracy as a percentage
  }
});

const Statement = mongoose.model('Statement', StatementSchema);
export default Statement;

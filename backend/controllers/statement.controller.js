import Statement from '../models/statement.model.js';
import Transaction from '../models/transaction.model.js';

// Controller for creating a new statement
export const createStatement = async (req, res) => {
    const { transactions, accuracy } = req.body;
  
    try {
      // Save each transaction in the array before creating the statement
      const transactionIds = [];
      for (const transactionData of transactions) {
        const transaction = new Transaction(transactionData);
        await transaction.save(); // Save transaction
        transactionIds.push(transaction._id); // Collect the saved transaction IDs
      }
  
      // Create and save the new statement with the saved transaction IDs
      const newStatement = new Statement({
        transactions: transactionIds,
        accuracy,
      });
  
      await newStatement.save();
      return res.status(201).json({ message: 'Statement created successfully', statement: newStatement });
    } catch (error) {
      return res.status(500).json({ error: 'Server error while creating statement' });
    }
  };
  
  // Controller for retrieving all statements with transactions populated
  export const getStatements = async (req, res) => {
    try {
      const statements = await Statement.find().populate('transactions');
      return res.status(200).json({ statements });
    } catch (error) {
      return res.status(500).json({ error: 'Server error while retrieving statements' });
    }
  };
  
  // Controller for retrieving a specific statement by id with transactions populated
  export const getStatementById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const statement = await Statement.findById(id).populate('transactions');
  
      if (!statement) {
        return res.status(404).json({ error: 'Statement not found' });
      }
  
      return res.status(200).json({ statement });
    } catch (error) {
      return res.status(500).json({ error: 'Server error while retrieving statement' });
    }
  };
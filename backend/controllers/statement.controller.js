import Statement from '../models/statement.model.js';
import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';

// Controller for creating a new statement for a specific user
export const createStatement = async (req, res) => {
  const { transactions, accuracy } = req.body;
  const userId = req.user.id; // Assuming the userId is passed from a middleware (like JWT)

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
      // user: userId, // Associate with user
      transactions: transactionIds,
      accuracy,
    });

    await newStatement.save();

    // Update the user document by pushing the new statement into their statements array
    await User.findByIdAndUpdate(
      userId,
      { $push: { statements: newStatement._id } }, // Add statement reference to user's statements array
      { new: true }
    );

    return res.status(201).json({ message: 'Statement created successfully', statement: newStatement });
  } catch (error) {
    return res.status(500).json({ error: 'Server error while creating statement' });
  }
};

// Controller for retrieving all statements for a specific user
export const getStatements = async (req, res) => {
  const userId = req.user.id; // Assuming the userId is passed from a middleware (like JWT)

  try {
    // Find all statements for the specific user
    const user = await User.findById(userId).populate({
      path: 'statements',
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ statements: user.statements });
  } catch (error) {
    return res.status(500).json({ error: 'Server error while retrieving statements' });
  }
};

// Controller for retrieving a specific statement by id for a specific user
export const getStatementById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Assuming the userId is passed from a middleware (like JWT)

  try {
    // Find the statement by id and ensure it belongs to the user
    const statement = await Statement.findOne({ _id: id }).populate('transactions');

    if (!statement) {
      return res.status(404).json({ error: 'Statement not found or does not belong to this user' });
    }

    return res.status(200).json({ statement });
  } catch (error) {
    return res.status(500).json({ error: 'Server error while retrieving statement' });
  }
};

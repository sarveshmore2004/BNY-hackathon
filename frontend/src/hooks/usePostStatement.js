// hooks/usePostStatement.js
import { useState } from "react";

const usePostStatement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postStatement = async (tableData, accuracy) => {
    setLoading(true);
    setError(null);

    try {
      // Map tableData to match the backend's expected structure
      const formattedTransactions = tableData.map((item) => ({
        clientName: item.clientName,
        bankName: item.bankName,
        accountNumber: item.accountNumber,
        transactionDate: item.transactionDate,
        type: item.creditDebit.toLowerCase(), // Convert 'Credit'/'Debit' to 'credit'/'debit'
        description: item.description,
        amount: parseFloat(item.amount), // Convert string to number
        balance: parseFloat(item.balance), // Convert string to number
      }));

      const response = await fetch('/api/statements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions: formattedTransactions,
          accuracy: accuracy, // Pass in the accuracy dynamically
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post statement");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { postStatement, loading, error };
};

export default usePostStatement;

// hooks/useUpdateTransaction.js
import { useState } from "react";

const useUpdateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTransaction = async (transactionId, tableData) => {
    setLoading(true);
    setError(null);

    try {
      // Map tableData to match the backend's expected structure
      const formattedTransaction = {
        clientName: tableData.clientName || "",
        bankName: tableData.bankName || "",
        accountNumber: tableData.accountNumber || "",
        transactionDate: tableData.transactionDate || "",
        type: tableData.type ? tableData.type.toLowerCase() : "", // Convert 'Credit'/'Debit' to 'credit'/'debit'
        description: tableData.description || "",
        amount: tableData.amount ? parseFloat(tableData.amount) : 0, // Convert string to number
        balance: tableData.balance ? parseFloat(tableData.balance) : 0, // Convert string to number
      };

      console.log(formattedTransaction);

      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedTransaction),
      });

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateTransaction, loading, error };
};

export default useUpdateTransaction;

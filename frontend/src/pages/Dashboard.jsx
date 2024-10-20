import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Footer } from "flowbite-react";
import { Bar, Pie, Line, Doughnut, Scatter } from "react-chartjs-2";
import useGetAllStatements from "../hooks/useGetAllStatements";
import useGetStatementById from "../hooks/useGetStatementById";
import useGemini from "../hooks/useGemini";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import useUpdateTransaction from "../hooks/useUpdateTransaction";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Utility functions for date formatting
const formatDateToDDMMYYYY = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateToYYYYMMDD = (ddmmyyyy) => {
  const [day, month, year] = ddmmyyyy.split('/');
  return `${year}-${month}-${day}`;
};

// Function to format number with commas
const formatNumberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Function to parse number from string
const parseNumberFromString = (str) => {
  return parseFloat(str.replace(/,/g, ''));
};

function Dashboard() {
  const { fetchStatements, loading, error } = useGetAllStatements();
  const [selectedStatementId, setSelectedStatementId] = useState(null);
  const { statement: selectedTableData, setStatement, loading: statementLoading, error: statementError } = useGetStatementById(selectedStatementId);
  const [data, setData] = useState(null);
  const [fraudGemini, setFraudGemini] = useState('');

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  // State for various fraud detection features
  const [duplicates, setDuplicates] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [multipleTransactionsSameDay, setMultipleTransactionsSameDay] = useState([]);
  const [multipleTransactionCount, setMultipleTransactionCount] = useState(0);
  const [frequentSmallTransactions, setFrequentSmallTransactions] = useState([]);
  const [frequentSmallTransactionCount, setFrequentSmallTransactionCount] = useState(0);
  const [unusuallyHighTransactions, setUnusuallyHighTransactions] = useState([]);
  const [unusuallyHighTransactionCount, setUnusuallyHighTransactionCount] = useState(0);

  // State for showing more/less
  const [showMoreDuplicates, setShowMoreDuplicates] = useState(false);
  const [showMoreSameDay, setShowMoreSameDay] = useState(false);
  const [showMoreSmallTransactions, setShowMoreSmallTransactions] = useState(false);
  const [showMoreHighTransactions, setShowMoreHighTransactions] = useState(false);


  const { updateTransaction, loading:updateLoading, error:updateError } = useUpdateTransaction();


  // Function to handle editing a transaction
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({
      ...selectedTableData.statement.transactions[index],
      transactionDate: (selectedTableData.statement.transactions[index].transactionDate),
      amount: formatNumberWithCommas(selectedTableData.statement.transactions[index].amount),
      balance: formatNumberWithCommas(selectedTableData.statement.transactions[index].balance),
    });
    setIsEditing(true);
  };

  // Function to handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTransactions = [...selectedTableData.statement.transactions];
    updatedTransactions[editIndex] = {
      ...editData,
      transactionDate: (editData.transactionDate),
      amount: parseNumberFromString(editData.amount),
      balance: parseNumberFromString(editData.balance),
    };
    // Here you would typically update the state or make an API call to update the data
    try {
      console.log(editData._id, updatedTransactions[editIndex])
      const result = await updateTransaction(editData._id, updatedTransactions[editIndex]);
      console.log("Transaction updated successfully", result);

         // Now update the selectedTableData with the new transactions array
    const updatedTableData = {
      ...selectedTableData,  // Copy the original selectedTableData
      statement: {
        ...selectedTableData.statement,  // Copy other parts of the statement
        transactions: updatedTransactions // Set the new updated transactions array
      }
    };

    // Use setStatement to update the state with the new data
    setStatement(updatedTableData);
    console.log("Updated selectedTableData:", updatedTableData);
    } catch (err) {
      console.error("Error updating transaction:", err);
    }
    
    // setStatement({...selectedTableData ,})
    console.log("Updated transaction:", updatedTransactions);
    console.log("selectedTableData:", selectedTableData);
    setIsEditing(false);
    setEditIndex(null);
    setEditData({});
  };

  // Function to export data to CSV
  const exportToCSV = () => {
    const csvRows = [];
    const headers = ["Client Name", "Bank Name", "Account Number", "Transaction Date", "Credit/Debit", "Description", "Amount ($)", "Balance ($)"];
    csvRows.push(headers.join(','));

    selectedTableData.statement.transactions.forEach((row) => {
      const values = [
        row.clientName,
        row.bankName,
        row.accountNumber,
        row.transactionDate,
        row.type,
        row.description,
        formatNumberWithCommas(row.amount),
        formatNumberWithCommas(row.balance),
      ];
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'financial_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ... (keep all other existing functions like findDuplicates, checkMultipleTransactionsSameDay, etc.)
  const findDuplicates = () => {
    const transactionCount = {};
    
    // Count occurrences of each transaction
    selectedTableData?.statement?.transactions?.forEach(transaction => {
      const key = JSON.stringify({
        clientName: transaction.clientName,
        transactionDate: transaction.transactionDate,
        amount: transaction.amount,
        description: transaction.description,
      }); // Create a unique key for each transaction
      transactionCount[key] = (transactionCount[key] || 0) + 1;
    });

    // Filter to find duplicates
    const duplicateTransactions = Object.entries(transactionCount)
      .filter(([_, count]) => count > 1)
      .map(([key, count]) => ({
        transaction: JSON.parse(key), // Convert back to original object
        count
      }));

    setDuplicates(duplicateTransactions);
    setTotalCount(duplicateTransactions.length);
  };

  const checkMultipleTransactionsSameDay = () => {
    const transactionMap = {};

    // Count transactions per account per day
    selectedTableData?.statement?.transactions?.forEach(transaction => {
        const key = `${transaction.accountNumber}-${transaction.transactionDate}`;
        transactionMap[key] = (transactionMap[key] || 0) + 1;
    });

    const flaggedTransactions = Object.entries(transactionMap)
        .filter(([_, count]) => count > 1)
        .map(([key, count]) => {
            const [account, date] = key.split('-');
            return { account, date, count };
        });

    setMultipleTransactionsSameDay(flaggedTransactions);
    setMultipleTransactionCount(flaggedTransactions.length);
};



const checkFrequentSmallTransactions = () => {
  const smallTransactionMap = {};

  // Define thresholds
  const smallAmountThreshold = 101; // Define what is considered a "small" transaction
  const largeAmountThreshold = 199; // Define the large amount threshold

  // Count small transactions per account and month
  selectedTableData?.statement?.transactions?.forEach(transaction => {
      const [day, month, year] = transaction.transactionDate.split('/').map(Number); // Split and convert to numbers
      const monthYearKey = `${transaction.accountNumber}-${year}-${month}`; // Format: account-YYYY-MM
      const amount = parseFloat(transaction.amount);

      if (amount < smallAmountThreshold) {
          smallTransactionMap[monthYearKey] = (smallTransactionMap[monthYearKey] || 0) + amount;
      }
  });

  // Filter out accounts with a sum greater than the large amount threshold
  const flaggedSmallTransactions = Object.entries(smallTransactionMap)
      .filter(([_, totalAmount]) => totalAmount > largeAmountThreshold)
      .map(([key, totalAmount]) => {
          const [account, year, month] = key.split('-');
          return { account, year, month, totalAmount };
      });

  setFrequentSmallTransactions(flaggedSmallTransactions);
  setFrequentSmallTransactionCount(flaggedSmallTransactions.length);
};


const checkUnusuallyHighTransactions = () => {
  const transactionAmounts = {};
  const transactionCounts = {};
  const transactionData = {};

  // Calculate total amounts and counts for each account
  selectedTableData?.statement?.transactions?.forEach(transaction => {
      const account = transaction.accountNumber;
      const amount = parseFloat(transaction.amount);

      if (!transactionData[account]) {
          transactionData[account] = [];
          transactionAmounts[account] = 0;
          transactionCounts[account] = 0;
      }

      transactionData[account].push(amount);
      transactionAmounts[account] += amount;
      transactionCounts[account] += 1;
  });

  const unusuallyHighTransactions = [];

  // Calculate average and standard deviation, then flag unusually high transactions
  for (const account in transactionData) {
      const amounts = transactionData[account];
      const mean = transactionAmounts[account] / transactionCounts[account];

      // Calculate standard deviation
      const variance = amounts.reduce((acc, amount) => acc + Math.pow(amount - mean, 2), 0) / transactionCounts[account];
      const standardDeviation = Math.sqrt(variance);

      // Flag transactions that are more than 3 standard deviations above the mean
      selectedTableData?.statement?.transactions?.forEach(transaction => {
          if (transaction.accountNumber === account) {
              const amount = parseFloat(transaction.amount);
              if (amount > mean + 3 * standardDeviation) {
                  unusuallyHighTransactions.push({
                      account,
                      amount,
                      mean,
                      standardDeviation,
                      transactionDate: transaction.transactionDate,
                      description: transaction.description
                  });
              }
          }
      });
  }

  setUnusuallyHighTransactions(unusuallyHighTransactions);
  setUnusuallyHighTransactionCount(unusuallyHighTransactions.length);
};



  useEffect(() => {
    const getStatement = async () => {
      const data = await fetchStatements();
      setData(data);
      if (data) setSelectedStatementId(data.statements[0]._id);
    };
    getStatement();
  }, []);
  const createPrompt = (data) => {
    if (!data || data.length === 0) return '';
  
    return data.map(item => {
      return `Client Name: ${item.clientName}, Bank Name: ${item.bankName}, Account Number: ${item.accountNumber}, Transaction Date: ${item.transactionDate}, Credit/Debit: ${item.creditDebit}, Amount: ${item.amount}`;
    }).join('\n');
  };
  
    const {processText}=useGemini();
  useEffect(() => {
    if (selectedTableData) {
      const checkFraud = async () => {
        const prompt = createPrompt(selectedTableData.statement.transactions);
        const fraud = await processText(`I have a list of transactions with the following fields:
        - Client Name
        - Bank Name
        - Account Number
        - Transaction Date (mm/dd/yyyy)
        - Credit/Debit
        - Description
        - Amount
        - Balance
      Please analyze the following transactions and identify which ones have the highest likelihood of being fraudulent,give me the objects with the reason why you think they could be fradulent. Just give the transactions which are likely and the reasons and nothing else, be clear and concise:
      
      ${prompt}`);
      setFraudGemini(fraud)
      console.log(fraud)
      };
      
      
      checkFraud();
      findDuplicates();
      checkMultipleTransactionsSameDay();
      checkFrequentSmallTransactions();
      checkUnusuallyHighTransactions();
    }
  }, [selectedTableData]);

  const [selectedTableIndex, setSelectedTableIndex] = useState(0);

  // Loading or error handling for fetching all statements
  if (loading) {
    return (
      <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Loading or error handling for fetching the selected statement by ID
  if (statementLoading) {
    return (
      <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl">Loading statement data...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (statementError) {
    return (
      <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl">{statementError}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if no data is available for statements
  if (!data || data.statements.length === 0) {
    return (
      <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl">No data available to display charts.</p>
        </div>
        <Footer />
      </div>
    );
  }



    // Prepare chart data
    const balanceChartData = {
      labels: selectedTableData.statement.transactions.map(statement => statement.clientName),
      datasets: [
        {
          label: 'Balance',
          data: selectedTableData.statement.transactions.map(statement => parseFloat(statement.balance)),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  
    const creditDebitDistribution = selectedTableData.statement.transactions.reduce(
      (acc, statement) => {
        acc[statement.type] = (acc[statement.type] || 0) + 1;
        return acc;
      },
      {}
    );
  
    const creditDebitChartData = {
      labels: Object.keys(creditDebitDistribution),
      datasets: [
        {
          label: 'Credit/Debit Distribution',
          data: Object.values(creditDebitDistribution),
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        },
      ],
    };
  
    const transactionAmounts = selectedTableData.statement.transactions.map(statement => ({
      date: statement.transactionDate,
      amount: parseFloat(statement.amount),
    }));
  
    const transactionChartData = {
      labels: transactionAmounts.map(t => t.date),
      datasets: [
        {
          label: 'Transaction Amounts',
          data: transactionAmounts.map(t => t.amount),
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
        },
      ],
    };
  
    const doughnutChartData = {
      labels: selectedTableData.statement.transactions.map(statement => statement.clientName),
      datasets: [
        {
          label: 'Balance Distribution',
          data: selectedTableData.statement.transactions.map(statement => parseFloat(statement.balance)),
          backgroundColor: [
            'rgba(255, 205, 86, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
        },
      ],
    };
  
    const horizontalBarData = {
      labels: selectedTableData.statement.transactions.map(statement => statement.clientName),
      datasets: [
        {
          label: 'Transaction Amounts',
          data: selectedTableData.statement.transactions.map(statement => parseFloat(statement.amount)),
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
        },
      ],
    };
  
    const scatterData = {
      datasets: [
        {
          label: 'Transaction Amount vs Balance',
          data: selectedTableData.statement.transactions.map(statement => ({
            x: parseFloat(statement.balance),
            y: parseFloat(statement.amount),
          })),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    };
  
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Financial Overview',
        },
      },
    };
  
  // ... (keep all chart data preparation and rendering logic)

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
      <Header />
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar for statements */}
        <div className="bg-gray-800 p-4 w-1/4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Statements</h2>
          {data && data.statements.length > 0 && (
            <ul>
              {data.statements.map((statement, index) => (
                <li
                  key={statement._id}
                  onClick={() => setSelectedStatementId(statement._id)}
                  className={`cursor-pointer p-2 rounded mb-2 ${
                    selectedStatementId === statement._id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  Statement {index + 1}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-grow p-4 overflow-y-auto w-3/4">
          {/* Table rendering */}
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Data Table</h2>
            <button onClick={exportToCSV} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2">
              Export CSV
            </button>
            <table className="min-w-full bg-gray-800 rounded">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="p-2 border">Client Name</th>
                  <th className="p-2 border">Bank Name</th>
                  <th className="p-2 border">Account Number</th>
                  <th className="p-2 border">Transaction Date</th>
                  <th className="p-2 border">Credit/Debit</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Amount ($)</th>
                  <th className="p-2 border">Balance ($)</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedTableData && selectedTableData.statement.transactions.map((statement, index) => (
                  <tr key={index} className="bg-gray-800 text-gray-200">
                    <td className="p-2 border">{statement.clientName}</td>
                    <td className="p-2 border">{statement.bankName}</td>
                    <td className="p-2 border">{statement.accountNumber}</td>
                    <td className="p-2 border">{statement.transactionDate}</td>
                    <td className="p-2 border">{statement.type}</td>
                    <td className="p-2 border">{statement.description}</td>
                    <td className="p-2 border">${formatNumberWithCommas(statement.amount)}</td>
                    <td className="p-2 border">${formatNumberWithCommas(statement.balance)}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="mb-4 bg-gray-800 p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Edit Transaction</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Client Name</label>
                    <input
                      type="text"
                      value={editData.clientName || ''}
                      onChange={(e) => setEditData({ ...editData, clientName: e.target.value })}
                      className="w-full p-2 bg-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={editData.bankName || ''}
                      onChange={(e) => setEditData({ ...editData, bankName: e.target.value })}
                      className="w-full p-2 bg-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Account Number</label>
                    <input
                      type="text"
                      value={editData.accountNumber || ''}
                      onChange={(e) => setEditData({ ...editData, accountNumber: e.target.value })}
                      className="w-full p-2 bg-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Transaction Date</label>
                    <input
                      type="text"
                      value={editData.transactionDate || ''}
                      onChange={(e) => setEditData({ ...editData, transactionDate: e.target.value })}
                      className="w-full p-2 bg-gray-700 rounded"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Credit/Debit</label>
                    <input
                      type="text"
                      value={editData.type || ''}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                      className="w-full p-2 bg-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Description</label>
                    <input
                      type="text"
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full p-2 bg-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Amount ($)</label>
                    <input
                      type="text"
                      value={editData.amount || ''}
                      onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                      className="w-full p-2 bg-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Balance ($)</label>
                    <input
                      type="text"
                      value={editData.balance || ''}
                      onChange={(e) => setEditData({ ...editData, balance: e.target.value })}
                      className="w-full p-2 bg-gray-700 rounded"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Fraud Detection Sections */}
              {/* Display duplicate transactions */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Duplicate Transactions</h2>
          <h2 className="font-bold">Total Duplicates Found: {totalCount}</h2>
          {duplicates.length > 0 ? (
            <div>
              <ul>
                {(showMoreDuplicates ? duplicates : duplicates.slice(0, 3)).map((dup, index) => (
                  <li key={index} className="bg-gray-800 p-2 rounded mb-2">
                    {dup.transaction.clientName} - {dup.transaction.transactionDate} - {dup.transaction.amount} - {dup.transaction.description} (Count: {dup.count})
                  </li>
                ))}
              </ul>
              {duplicates.length > 3 && (
                <button
                  className="text-blue-500 underline mt-2"
                  onClick={() => setShowMoreDuplicates(!showMoreDuplicates)}
                >
                  {showMoreDuplicates ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          ) : (
            <p>No Duplicate Transactions Found</p>
          )}
        </div>

        {/* Display unusually high Multiple transactions on same day */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Multiple Transactions on Same Day</h2>
          {multipleTransactionsSameDay.length > 0 ? (
            <div>
              <h2 className="font-bold">Total Instances Found: {multipleTransactionCount}</h2>
              <ul>
                {(showMoreSameDay ? multipleTransactionsSameDay : multipleTransactionsSameDay.slice(0, 3)).map((item, index) => (
                  <li key={index} className="bg-gray-800 p-2 rounded mb-2">
                    Account: {item.account} - Date: {item.date} - Transactions Count: {item.count}
                  </li>
                ))}
              </ul>
              {multipleTransactionsSameDay.length > 3 && (
                <button
                  className="text-blue-500 underline mt-2"
                  onClick={() => setShowMoreSameDay(!showMoreSameDay)}
                >
                  {showMoreSameDay ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          ) : (
            <p>No Multiple Transactions Found</p>
          )}
        </div>

        {/* Display Frequent Small Transactions */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Frequent Small Transactions</h2>
          {frequentSmallTransactions.length > 0 ? (
            <div>
              <h2 className="font-bold">Total Instances Found: {frequentSmallTransactionCount}</h2>
              <ul>
                {(showMoreSmallTransactions ? frequentSmallTransactions : frequentSmallTransactions.slice(0, 5)).map((item, index) => (
                  <li key={index} className="bg-gray-800 p-2 rounded mb-2">
                    Account: {item.account} - Month: {item.month}/{item.year} - Total Small Amount: ${item.totalAmount.toFixed(2)}
                  </li>
                ))}
              </ul>
              {frequentSmallTransactions.length > 5 && (
                <button
                  className="text-blue-500 underline mt-2"
                  onClick={() => setShowMoreSmallTransactions(!showMoreSmallTransactions)}
                >
                  {showMoreSmallTransactions ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          ) : (
            <p>No Frequent Small Transactions Found</p>
          )}
        </div>

        {/* Display Unusually High Transactions */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Unusually High Transactions</h2>
          {unusuallyHighTransactions.length > 0 ? (
            <div>
              <h2 className="font-bold">Total Instances Found: {unusuallyHighTransactionCount}</h2>
              <ul>
                {(showMoreHighTransactions ? unusuallyHighTransactions : unusuallyHighTransactions.slice(0, 5)).map((item, index) => (
                  <li key={index} className="bg-gray-800 p-2 rounded mb-2">
                    Account: {item.account} - Amount: ${item.amount.toFixed(2)} - Mean: ${item.mean.toFixed(2)} - Std Dev: ${item.standardDeviation.toFixed(2)} - Date: {item.transactionDate} - Description: {item.description}
                  </li>
                ))}
              </ul>
              {unusuallyHighTransactions.length > 5 && (
                <button
                  className="text-blue-500 underline mt-2"
                  onClick={() => setShowMoreHighTransactions(!showMoreHighTransactions)}
                >
                  {showMoreHighTransactions ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          ) : (
            <p>No Unusually High Transactions Found</p>
          )}
        </div>

          {/* ... (keep all the fraud detection sections like Duplicate Transactions, Multiple Transactions on Same Day, etc.) */}

        {/* Display Detected Frauds */}
<div className="mb-4">
  <h2 className="text-lg font-bold text-red-500 mb-4">AI Detected Frauds</h2>
  {fraudGemini ? (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg ">
      <h2 >
        {fraudGemini}
      </h2>
    </div>
  ) : (
    <p className="text-gray-400">No Frauds Detected by Gemini</p>
  )}
</div>
{/* Grid for charts */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded h-full">
              <h2 className="text-lg font-bold mb-4">Balances by Client</h2>
              <Bar data={balanceChartData} options={chartOptions} />
            </div>
            <div className="bg-gray-800 p-4 rounded h-full">
              <h2 className="text-lg font-bold mb-4">Credit/Debit Distribution</h2>
              <Pie data={creditDebitChartData} options={chartOptions} />
            </div>
            <div className="bg-gray-800 p-4 rounded h-full">
              <h2 className="text-lg font-bold mb-4">Transaction Amounts Over Time</h2>
              <Line data={transactionChartData} options={chartOptions} />
            </div>
            <div className="bg-gray-800 p-4 rounded h-full">
              <h2 className="text-lg font-bold mb-4">Balance Distribution (Doughnut)</h2>
              <Doughnut data={doughnutChartData} options={chartOptions} />
            </div>
            <div className="bg-gray-800 p-4 rounded h-full">
              <h2 className="text-lg font-bold mb-4">Transaction Amounts (Horizontal Bar)</h2>
              <Bar data={horizontalBarData} options={{ ...chartOptions, indexAxis: 'y' }} />
            </div>
            <div className="bg-gray-800 p-4 rounded h-full">
              <h2 className="text-lg font-bold mb-4">Transaction Amount vs Balance (Scatter)</h2>
              <Scatter data={scatterData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
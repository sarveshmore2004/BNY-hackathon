import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Footer } from "flowbite-react";
import { Bar, Pie, Line, Doughnut, Scatter } from "react-chartjs-2";
import useGetAllStatements from "../hooks/useGetAllStatements";
import useGetStatementById from "../hooks/useGetStatementById";

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

function Dashboard() {
  const { fetchStatements , loading, error} = useGetAllStatements();
  const [selectedStatementId, setSelectedStatementId] = useState(null);
  const { statement: selectedTableData, loading: statementLoading, error: statementError } = useGetStatementById(selectedStatementId);
  const [data,setData]=useState(null);

  useEffect(() => {
    const getStatement=async()=>{
      const data=await fetchStatements();
      setData(data);
      if(data) setSelectedStatementId(data.statements[0]._id);
      console.log(selectedStatementId)
    }
    getStatement()
  }, []);

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
      acc[statement.creditDebit] = (acc[statement.creditDebit] || 0) + 1;
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

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
      <Header />
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar for tables */}
        <div className="bg-gray-800 p-4 w-1/4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Statements</h2>
          <ul>
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
          </ul>
        </div>

        {/* Main chart area */}
        <div className="flex-grow p-4 overflow-y-auto">
          {/* Table rendering */}
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Data Table</h2>
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
                {selectedTableData.statement.transactions.map((statement, index) => (
                  <tr key={index} className="bg-gray-800 text-gray-200">
                    <td className="p-2 border">{statement.clientName}</td>
                    <td className="p-2 border">{statement.bankName}</td>
                    <td className="p-2 border">{statement.accountNumber}</td>
                    <td className="p-2 border">{statement.transactionDate}</td>
                    <td className="p-2 border">{statement.type}</td>
                    <td className="p-2 border">{statement.description}</td>
                    <td className="p-2 border">${statement.amount}</td>
                    <td className="p-2 border">${statement.balance}</td>
                    <td className="p-2 border">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chart rendering */}
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Balance Chart</h2>
            <Bar data={balanceChartData} options={chartOptions} />
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Credit/Debit Distribution</h2>
            <Pie data={creditDebitChartData} options={chartOptions} />
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Transaction Amounts Over Time</h2>
            <Line data={transactionChartData} options={chartOptions} />
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Balance Distribution</h2>
            <Doughnut data={doughnutChartData} options={chartOptions} />
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Horizontal Bar of Transaction Amounts</h2>
            <Bar data={horizontalBarData} options={chartOptions} />
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Scatter Plot - Transaction vs Balance</h2>
            <Scatter data={scatterData} options={chartOptions} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;

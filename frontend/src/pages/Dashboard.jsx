import React, { useState } from "react";
import Header from "../components/Header";
import { Footer } from "flowbite-react";
import { Bar, Pie, Line, Doughnut, Scatter } from "react-chartjs-2";
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

function Dashboard({ tableData }) {
  // Create a dummy list by copying tableData 10 times for this demo
  
  const dummyTables = Array(10).fill(tableData); // statements

  // State for tracking selected table
  const [selectedTableIndex, setSelectedTableIndex] = useState(0);

  // Conditional rendering for null or empty tableData
  if (!tableData || tableData.length === 0) {
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

  // Use the currently selected table's data
  const selectedTableData = dummyTables[selectedTableIndex];

  // Prepare data for charts (same as before)
  const balanceChartData = {
    labels: selectedTableData.map(statement => statement.clientName),
    datasets: [
      {
        label: 'Balance',
        data: selectedTableData.map(statement => parseFloat(statement.balance)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const creditDebitDistribution = selectedTableData.reduce(
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

  const transactionAmounts = selectedTableData.map(statement => ({
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
    labels: selectedTableData.map(statement => statement.clientName),
    datasets: [
      {
        label: 'Balance Distribution',
        data: selectedTableData.map(statement => parseFloat(statement.balance)),
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
    labels: selectedTableData.map(statement => statement.clientName),
    datasets: [
      {
        label: 'Transaction Amounts',
        data: selectedTableData.map(statement => parseFloat(statement.amount)),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: 'Transaction Amount vs Balance',
        data: selectedTableData.map(statement => ({
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
          <h2 className="text-xl font-bold mb-4">Tables</h2>
          <ul>
            {dummyTables.map((_, index) => (
              <li
                key={index}
                onClick={() => setSelectedTableIndex(index)}
                className={`cursor-pointer p-2 rounded mb-2 ${
                  selectedTableIndex === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                Table {index + 1}
              </li>
            ))}
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
                {selectedTableData.map((statement, index) => (
                  <tr key={index} className="bg-gray-800 text-gray-200">
                    <td className="p-2 border">{statement.clientName}</td>
                    <td className="p-2 border">{statement.bankName}</td>
                    <td className="p-2 border">{statement.accountNumber}</td>
                    <td className="p-2 border">{statement.transactionDate}</td>
                    <td className="p-2 border">{statement.creditDebit}</td>
                    <td className="p-2 border">{statement.description}</td>
                    <td className="p-2 border">{statement.amount}</td>
                    <td className="p-2 border">{statement.balance}</td>
                    <td className="p-2 border">
                      <button className="text-blue-400 hover:underline">Edit</button>
                      <button className="text-red-400 hover:underline ml-2">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

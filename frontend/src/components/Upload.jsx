// Upload.jsx
import React, { useState } from "react";

function Upload({ onUploadData }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const generateDummyData = () => {
    const rows = [];
    const clientName = "John Doe"; // Dummy client name
    const bankName = "ABC Bank";   // Dummy bank name
    const accountNumber = `1234-5678-9012-3456`;  // Dummy account number
    
    // Simulating 10 rows of data with random integers
    for (let i = 0; i < 10; i++) {
      const isCredit = Math.random() > 0.5; // Randomly decide if it's a credit or debit
      rows.push({
        clientName, 
        bankName, 
        accountNumber,
        transactionDate: `2024-10-${Math.floor(Math.random() * 30 + 1)}`, // Random date
        creditDebit: isCredit ? "Credit" : "Debit", // Randomly set credit or debit
        description: `Transaction ${i + 1}`, // Dummy description
        amount: Math.floor(Math.random() * 1000), // Random amounts between 0 and 999
        balance: Math.floor(Math.random() * 5000), // Random balances between 0 and 4999
      });
    }
    return rows;
  };

  const handleUpload = (event) => {
    event.preventDefault();
    console.log("Uploaded file:", file);

    // After the upload, generate dummy data for the table
    const data = generateDummyData();
    onUploadData(data); // Pass the data to the parent component
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-200">Upload PDF</h1>
      <form onSubmit={handleUpload} className="space-y-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
          className="block w-full text-gray-300 bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default Upload;

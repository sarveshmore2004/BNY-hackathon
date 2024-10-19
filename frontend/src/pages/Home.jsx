// Home.jsx
import React, { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Upload from "../components/Upload";
import Table from "../components/Table";
import useGemini from "../hooks/useGemini"; // Import the useGemini hook

function Home() {
  const { processText, loading, result, error } = useGemini(); // Using the hook
  const [tableData, setTableData] = useState(null); // Store the extracted data for the table
  const [extractedText, setExtractedText] = useState("");

  const handleUploadData = (data) => {
    console.log(data)
    setTableData(data); // Set the table data from the Upload component
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Upload 
          onUploadData={handleUploadData} 
          setExtractedText={setExtractedText} 
          processText={processText} 
          loading={loading}
          result={result}
          error={error}
        />
        {tableData && <Table data={tableData} />}
      </div>
      <Footer />
    </div>
  );
}

export default Home;


// Home.jsx
// import React, { useState } from "react";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import Upload from "../components/Upload";
// import Table from "../components/Table";

// function Home() {
//   const [tableData, setTableData] = useState(null); // Store the dummy data for the table

//   const handleUploadData = (data) => {
//     setTableData(data); // Set the table data from the Upload component
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-900 text-white">
//       <Header />
//       <div className="flex-1 flex flex-col items-center justify-center p-4">
//         <Upload onUploadData={handleUploadData} />
//         {tableData && <Table data={tableData} />}
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default Home;



// import { useState } from "react";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import useGemini from "../hooks/useGemini"; // Import the useGemini hook

// function Home() {
//   const [file, setFile] = useState(null);
//   const [extractedText, setExtractedText] = useState("");
//   const { processText, loading, result, error } = useGemini(); // Using the hook

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUpload = async (event) => {
//     event.preventDefault();
    
//     // Simulate text extraction from the uploaded PDF
//     // Replace this with actual extraction logic in the future
//     // const simulatedExtractedText = "This is the simulated extracted text from the PDF.";
//     const extractedData = `231 Valley Farms Street
// Santa Monica, CA 90403 B3 BANK STATEMENT OF ACCOUNT
// 83bank@domain.com
// [Hl
// Account Number: ~~ 111-234-567-890
// StatementDate: 01/01/2021 Page 1 of 1
// Period Covered: 12/01/2020 to 12/31/2020
// Mr. John Doe. Opening Balance: 175,800.00
// 1 STUART PLACE Total Credit Amount: 510,000.00 |
// NORTHCUIFF EXTL TEST CITY Total Debit Amount: 494,000.00
// Closing Balance: 191,800.00
// Test Branch Account Type: Current Account
// Number of Transactions: 8
// Transactions
// Date Description Credit Debit Balance
// 12/01/2020 Payment - Credit Card 5,400.00 170,400.00
// 12/05/2020 Payment - Insurance 3,000.00 167,400.00
// 12/08/2020 Account Transfer In 500,000.00 667,400.00
// 12/09/2020 Cheque Deposit 10,000.00 677,400.00
// 12/10/2020 Payment - Electricity 1,500.00 675,900.00
// 12/12/2020 Payment - Water Utility 600.00 675,300.00
// 12/15/2020 Payment - Car Loan 403,500.00 271,800.00
// 12/20/2020 Account Transfer Out 20,000.00 191,800.00
// End of Transactions`; // Add more data as needed

// const simulatedExtractedText = `I have extracted data from an image containing financial transactions, which may include various fields in different formats and irrelevant information. Please analyze the extracted data and identify the relevant financial table, typically including:

// - Client Name
// - Bank Name
// - Account Number
// - Transaction Date (mm/dd/yyyy)
// - Credit/Debit
// - Description
// - Amount
// - Balance

// Focus only on structured data. Here is the extracted data:

// ${extractedData}

// Format the relevant transactions as follows:

// Transaction 1:
// Client Name: 
// Bank Name: 
// Account Number: 
// Transaction Date: 
// Credit/Debit: 
// Description: 
// Amount: 
// Balance: 

// Ignore any irrelevant text.`;


//     setExtractedText(simulatedExtractedText); // Set the simulated text for testing

//     // Call the Gemini API with the extracted text
//     await processText(simulatedExtractedText);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-900 text-white">
//       <Header />
//       <div className="flex-1 flex items-center justify-center">
//         <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h1 className="text-4xl font-bold mb-6 text-center text-gray-200">
//             Upload PDF
//           </h1>
//           <form onSubmit={handleUpload} className="space-y-6">
//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={handleFileChange}
//               required
//               className="block w-full text-gray-300 bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//             />
//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
//             >
//               Upload
//             </button>
//           </form>

//           {/* Display loading state, errors, and the result */}
//           {loading && <p className="text-center mt-4">Processing...</p>}
//           {error && <p className="text-red-500 mt-4">Error: {error}</p>}
//           {result && <p className="mt-4">Gemini Response: {result}</p>}
//           {extractedText && (
//             <p className="mt-4">Extracted Text: {extractedText}</p>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default Home;


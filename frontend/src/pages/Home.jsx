// import React, { useState } from "react";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import { useTable } from "react-table";

// function Home() {
//   const [file, setFile] = useState(null);
//   const [tableData, setTableData] = useState(null); // Store the dummy data for the table
//   const [showMore, setShowMore] = useState(false); // State to toggle "Show More" / "Show Less"

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const generateDummyData = () => {
//     const rows = [];
//     const clientName = "John Doe"; // Dummy client name
//     const bankName = "ABC Bank";   // Dummy bank name
//     const accountNumber = `1234-5678-9012-3456`;  // Dummy account number
    
//     // Simulating 10 rows of data with random integers
//     for (let i = 0; i < 10; i++) {
//       const isCredit = Math.random() > 0.5; // Randomly decide if it's a credit or debit
//       rows.push({
//         clientName, 
//         bankName, 
//         accountNumber,
//         transactionDate: `2024-10-${Math.floor(Math.random() * 30 + 1)}`, // Random date
//         creditDebit: isCredit ? "Credit" : "Debit", // Randomly set credit or debit
//         description: `Transaction ${i + 1}`, // Dummy description
//         amount: Math.floor(Math.random() * 1000), // Random amounts between 0 and 999
//         balance: Math.floor(Math.random() * 5000), // Random balances between 0 and 4999
//       });
//     }
//     return rows;
//   };

//   const handleUpload = (event) => {
//     event.preventDefault();

//     // Simulating file upload logic
//     console.log("Uploaded file:", file);

//     // After the upload, generate dummy data for the table
//     const data = generateDummyData();
//     setTableData(data); // Set the table data
//   };

//   // Define columns for the react-table
//   const columns = React.useMemo(
//     () => [
//       { Header: "Client Name", accessor: "clientName" },
//       { Header: "Bank Name", accessor: "bankName" },
//       { Header: "Account Number", accessor: "accountNumber" },
//       { Header: "Transaction Date", accessor: "transactionDate" },
//       { Header: "Credit/Debit", accessor: "creditDebit" },
//       { Header: "Description", accessor: "description" },
//       { Header: "Amount ($)", accessor: "amount" },
//       { Header: "Balance ($)", accessor: "balance" }
//     ],
//     []
//   );

//   // Limit for initial rows display (show only 5 rows by default)
//   const rowLimit = 5;

//   // Toggle between showing all rows and limiting to 5 rows
//   const toggleShowMore = () => {
//     setShowMore(!showMore);
//   };

//   // Decide how many rows to display based on the state of `showMore`
//   const dataToDisplay = showMore ? tableData : tableData?.slice(0, rowLimit);

//   // Use the react-table hook
//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
//     columns,
//     data: dataToDisplay || [],
//   });

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-900 text-white">
//       <Header />
//       <div className="flex-1 flex flex-col items-center justify-center p-4">
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
//         </div>

//         {/* Conditionally render the table if tableData exists */}
//         {tableData && (
//           <div className="mt-10 w-[80vw] bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
//             <h2 className="text-2xl font-semibold mb-4 text-gray-200">
//               Extracted Bank Statement
//             </h2>
//             <table {...getTableProps()} className="w-full table-auto text-left text-gray-200">
//               <thead>
//                 {headerGroups.map((headerGroup) => (
//                   <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-700">
//                     {headerGroup.headers.map((column) => (
//                       <th {...column.getHeaderProps()} className="py-4 px-4 text-lg"> {/* Increased font size here */}
//                         {column.render("Header")}
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()}>
//                 {rows.map((row) => {
//                   prepareRow(row);
//                   return (
//                     <tr {...row.getRowProps()} className="border-t border-gray-600">
//                       {row.cells.map((cell) => (
//                         <td {...cell.getCellProps()} className="py-4 px-4 text-lg"> {/* Increased font size here */}
//                           {cell.render("Cell")}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>

//             {/* Show More / Show Less Button */}
//             {tableData.length > rowLimit && (
//               <div className="flex justify-end mt-4">
//                 <button
//                   onClick={toggleShowMore}
//                   className="text-blue-500 hover:underline"
//                 >
//                   {showMore ? "Show Less" : "Show More"}
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default Home;





// Home.jsx
import React, { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Upload from "../components/Upload";
import Table from "../components/Table";

function Home() {
  const [tableData, setTableData] = useState(null); // Store the dummy data for the table

  const handleUploadData = (data) => {
    setTableData(data); // Set the table data from the Upload component
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Upload onUploadData={handleUploadData} />
        {tableData && <Table data={tableData} />}
      </div>
      <Footer />
    </div>
  );
}

export default Home;


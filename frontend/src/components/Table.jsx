import React, { useMemo, useState, useEffect } from "react";
import { useTable } from "react-table";
import Modal from "react-modal";
import usePostStatement from "../hooks/usePostStatement"; // Import the usePostStatement hook

Modal.setAppElement('#root'); // Set the app element for accessibility

function Table({ data, onUpdateData }) {
  const [showMore, setShowMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [accuracy, setAccuracy] = useState(0); // State for calculated accuracy

  // Using the usePostStatement hook
  const { postStatement, loading: postingLoading, error: postingError } = usePostStatement();

  // Define columns for the react-table
  const columns = useMemo(
    () => [
      { Header: "Client Name", accessor: "clientName" },
      { Header: "Bank Name", accessor: "bankName" },
      { Header: "Account Number", accessor: "accountNumber" },
      { Header: "Transaction Date", accessor: "transactionDate" },
      { Header: "Credit/Debit", accessor: "creditDebit" },
      { Header: "Description", accessor: "description" },
      { Header: "Amount ($)", accessor: "amount" },
      { Header: "Balance ($)", accessor: "balance" },
    ],
    []
  );

  const rowLimit = 5;
  const toggleShowMore = () => setShowMore(!showMore);
  const dataToDisplay = showMore ? data : data?.slice(0, rowLimit);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: dataToDisplay || [],
  });

  const handleEdit = (index) => {
    setEditRowIndex(index);
    setEditRowData(data[index]);
    setIsEditing(true);
    document.body.style.overflow = 'hidden';
  };

  const handleUpdate = () => {
    const updatedData = [...data];
    updatedData[editRowIndex] = editRowData;
    onUpdateData(updatedData);
    setIsEditing(false);
    setEditRowIndex(null);
    setEditRowData({});
    document.body.style.overflow = 'auto';
  };

  const handleClose = () => {
    setIsEditing(false);
    document.body.style.overflow = 'auto';
  };

  // Function to save the statement
  const handleSaveStatement = async () => {
    console.log(data, accuracy);
    const response = await postStatement(data, accuracy);
    if (response) {
      console.log("Statement saved successfully:", response);
    }
  };

  // Function to export table data to CSV
  const exportToCSV = () => {
    const csvRows = [];
    const headers = columns.map((column) => column.Header);
    csvRows.push(headers.join(','));

    data.forEach((row) => {
      const values = columns.map((column) => {
        const value = row[column.accessor];
        return `"${value}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bank_statement.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

// Function to calculate accuracy
useEffect(() => {
  let correctCount = 0;
  let totalCount = 0;

  data.forEach((row, index) => {
    if (
      row.balance != null &&
      row.amount != null &&
      data[index - 1]?.balance != null // Use previous row's balance
    ) {
      const previousBalance = parseFloat(data[index - 1].balance);
      const amount = parseFloat(row.amount);

      // Calculate expected balance for current row based on previous balance
      const expectedBalance =
        row.creditDebit === "Credit"
          ? previousBalance + amount
          : previousBalance - amount;

      // Compare the expected balance with the actual balance
      if (Math.abs(expectedBalance - parseFloat(row.balance)) < 0.01) {
        correctCount++;
      }
      totalCount++;
    }
  });

  if (totalCount > 0) {
    setAccuracy(((correctCount / totalCount) * 100).toFixed(2)); // Calculate accuracy percentage
  } else {
    setAccuracy(100); // If no rows to compare, assume 100% accuracy
  }
}, [data]);


  return (
    <div className="mt-10 w-[90vw] bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-200">Extracted Bank Statement</h2>
      <table {...getTableProps()} className="w-full table-auto text-left text-gray-200">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-700">
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="py-4 px-4 text-lg">
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-t border-gray-600">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="py-4 px-4 text-lg">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {data.length > rowLimit && (
        <div className="flex justify-end mt-4">
          <button onClick={toggleShowMore} className="text-blue-500 hover:underline">
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>
      )}

      {data.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={exportToCSV}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Export to CSV
          </button>
        </div>
      )}

      {/* Display Accuracy */}
      <div className="flex justify-end mt-4">
        <p className="text-gray-200">Accuracy: {accuracy}%</p>
        <button
          onClick={handleSaveStatement}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ml-2"
          disabled={postingLoading} // Disable button while loading
        >
          {postingLoading ? "Saving..." : "Save Statement"}
        </button>
        {postingError && <p className="text-red-500 mt-2">{postingError}</p>}
      </div>
    </div>
  );
}

export default Table;

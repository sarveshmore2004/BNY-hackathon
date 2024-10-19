import React, { useMemo, useState, useEffect } from "react";
import { useTable } from "react-table";
import Modal from "react-modal";

Modal.setAppElement('#root'); // Set the app element for accessibility

function Table({ data, onUpdateData }) {
  const [showMore, setShowMore] = useState(false); // State to toggle "Show More" / "Show Less"
  const [isEditing, setIsEditing] = useState(false); // State to handle editing
  const [editRowIndex, setEditRowIndex] = useState(null); // Track the index of the row being edited
  const [editRowData, setEditRowData] = useState({}); // Store the data of the row being edited

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
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <button
            onClick={() => handleEdit(row.index)}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>
        ),
      },
    ],
    []
  );

  // Limit for initial rows display (show only 5 rows by default)
  const rowLimit = 5;

  // Toggle between showing all rows and limiting to 5 rows
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // Decide how many rows to display based on the state of showMore
  const dataToDisplay = showMore ? data : data?.slice(0, rowLimit);

  // Use the react-table hook
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: dataToDisplay || [],
  });

  const handleEdit = (index) => {
    setEditRowIndex(index);
    setEditRowData(data[index]); // Get the data of the row being edited
    setIsEditing(true); // Open the edit form
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const handleUpdate = () => {
    const updatedData = [...data]; // Create a copy of the data
    updatedData[editRowIndex] = editRowData; // Replace the old data with the updated data
    onUpdateData(updatedData); // Call the parent to update data
    setIsEditing(false); // Close the edit form
    setEditRowIndex(null); // Reset edit row index
    setEditRowData({}); // Reset edit row data
    document.body.style.overflow = 'auto'; // Restore background scroll
  };

  const handleClose = () => {
    setIsEditing(false); // Close the edit form
    document.body.style.overflow = 'auto'; // Restore background scroll
  };

  // Function to export table data to CSV
  const exportToCSV = () => {
    const csvRows = [];

    // Get headers
    const headers = columns.map(column => column.Header);
    csvRows.push(headers.join(','));

    // Get data rows
    data.forEach(row => {
      const values = columns.map(column => {
        const value = row[column.accessor];
        return `"${value}"`; // Wrap values in quotes
      });
      csvRows.push(values.join(','));
    });

    // Create a blob from the CSV string and trigger a download
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

      {/* Show More / Show Less Button */}
      {data.length > rowLimit && (
        <div className="flex justify-end mt-4">
          <button
            onClick={toggleShowMore}
            className="text-blue-500 hover:underline"
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>
      )}

      {/* Export to CSV Button */}
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

      {/* Edit Form in Modal */}
      <Modal
        isOpen={isEditing}
        onRequestClose={handleClose} // Close function now handles scroll restoration
        contentLabel="Edit Transaction"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm" // Changed backdrop blur to sm
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[90vw] max-w-lg">
          <h3 className="text-lg font-semibold text-gray-200">Edit Transaction</h3>
          <form className="space-y-4">
            {Object.keys(editRowData).map((key) => (
              <div key={key}>
                <label className="block text-sm text-white">{key.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="text"
                  value={editRowData[key]}
                  onChange={(e) => setEditRowData({ ...editRowData, [key]: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md text-white"
                />
              </div>
            ))}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Table;

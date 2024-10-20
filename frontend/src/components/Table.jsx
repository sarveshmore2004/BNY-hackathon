import React, { useMemo, useState } from "react";
import { useTable } from "react-table";
import Modal from "react-modal";
import usePostStatement from "../hooks/usePostStatement"; // Import the usePostStatement hook

Modal.setAppElement('#root'); // Set the app element for accessibility

function Table({ data, onUpdateData }) {
  const [showMore, setShowMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [accuracy, setAccuracy] = useState(0); // State for accuracy input

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
    console.log(data , accuracy)
    const response = await postStatement(data, accuracy);
    if (response) {
      console.log("Statement saved successfully:", response);
    }
  };

  // Function to export table data to CSV
  const exportToCSV = () => {
    const csvRows = [];
    const headers = columns.map(column => column.Header);
    csvRows.push(headers.join(','));

    data.forEach(row => {
      const values = columns.map(column => {
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

      {/* Accuracy Input */}
      <div className="flex justify-end mt-4">
        <input
          type="number"
          placeholder="Accuracy (%)"
          value={accuracy}
          onChange={(e) => setAccuracy(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
        />
        <button
          onClick={handleSaveStatement}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ml-2"
          disabled={postingLoading} // Disable button while loading
        >
          {postingLoading ? "Saving..." : "Save Statement"}
        </button>
        {postingError && <p className="text-red-500 mt-2">{postingError}</p>}
      </div>

      <Modal
        isOpen={isEditing}
        onRequestClose={handleClose}
        contentLabel="Edit Transaction"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"
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
 
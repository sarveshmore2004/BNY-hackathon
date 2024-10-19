import React, { useMemo, useState } from "react";
import { useTable } from "react-table";

// Utility function to convert data to CSV and trigger download
const exportToCSV = (data, columns) => {
  const headers = columns.map((col) => col.Header).join(",");
  const rows = data.map((row) =>
    columns.map((col) => row[col.accessor]).join(",")
  );

  const csvContent = [headers, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", "bank_statements.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function Table({ data }) {
  const [showMore, setShowMore] = useState(false); // State to toggle "Show More" / "Show Less"

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
      { Header: "Balance ($)", accessor: "balance" }
    ],
    []
  );

  // Limit for initial rows display (show only 5 rows by default)
  const rowLimit = 5;

  // Toggle between showing all rows and limiting to 5 rows
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // Decide how many rows to display based on the state of `showMore`
  const dataToDisplay = showMore ? data : data?.slice(0, rowLimit);

  // Use the react-table hook
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: dataToDisplay || [],
  });

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

      {/* Export as CSV Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => exportToCSV(data, columns)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Export as CSV
        </button>
      </div>
    </div>
  );
}

export default Table;

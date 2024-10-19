import React, { useState } from "react";
import useGetAllStatements from "../hooks/useGetAllStatements";
import Table from "../components/Table";
import Header from "../components/Header";
import { Footer } from "flowbite-react";

function Dashboard() {
  const { statements, loading, error } = useGetAllStatements();
  const [selectedStatement, setSelectedStatement] = useState(null);

  const handleSelectStatement = (statement) => {
    setSelectedStatement(statement);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />

      <Footer />
    </div>
      {/* <h1 className="text-3xl text-center py-4">Statements Dashboard</h1>
      {loading && <p className="text-center">Loading statements...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="flex flex-col items-center justify-center p-4">
        {statements.length > 0 && (
          <div className="w-full max-w-4xl">
            <h2 className="text-xl mb-4">Statements List</h2>
            <ul className="list-none p-0">
              {statements.map((statement) => (
                <li
                  key={statement._id}
                  className="cursor-pointer py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg mb-2"
                  onClick={() => handleSelectStatement(statement)}
                >
                  Statement ID: {statement._id} (Accuracy: {statement.accuracy}%)
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedStatement && (
          <div className="w-full max-w-4xl mt-8">
            <h2 className="text-xl mb-4">Statement Details</h2>
            <p>Accuracy: {selectedStatement.accuracy}%</p>
            <Table data={selectedStatement.transactions} />
          </div>
        )}
      </div> */}
    </div>
  );
}

export default Dashboard;

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

  // Function to update the table data
  const handleUpdateData = (updatedData) => {
    setTableData(updatedData);
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
        {tableData && <Table data={tableData} onUpdateData={handleUpdateData} />}
      </div>
      <Footer />
    </div>
  );
}

export default Home;

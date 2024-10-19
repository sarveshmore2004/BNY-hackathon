import React, { useState, useEffect } from "react";

function Upload({ onUploadData, setExtractedText, processText, loading, result, error }) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]); // State to store parsed data

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    console.log("Uploaded file:", file);

    const formData = new FormData();
    formData.append('pdf', file);
    let response;
    try {
       response = await fetch('http://localhost:3000/api/ocr/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies if needed
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

    } catch (error) {
      console.error('Error uploading file:', error);
    }


      let extractedData = await response.json();
extractedData=extractedData.text
const simulatedExtractedText = `I have extracted data from an image containing financial transactions, which may include various fields in different formats and irrelevant information. Please analyze the extracted data and identify the relevant financial table, typically including:

- Client Name
- Bank Name
- Account Number
- Transaction Date (mm/dd/yyyy)
- Credit/Debit
- Description
- Amount
- Balance

Focus only on structured data. Here is the extracted data:

${extractedData}

Now, return the relevant transactions in a structured JSON format like this:

[
  {
    "clientName": "Mr. John Doe",
    "bankName": "B3 BANK",
    "accountNumber": "111-234-567-890",
    "transactionDate": "12/01/2020",
    "creditDebit": "Credit",
    "description": "Payment - Credit Card",
    "amount": "5400.00",
    "balance": "170400.00"
  },
  {
    "clientName": "Mr. John Doe",
    "bankName": "B3 BANK",
    "accountNumber": "111-234-567-890",
    "transactionDate": "12/05/2020",
    "creditDebit": "Credit",
    "description": "Payment - Insurance",
    "amount": "3000.00",
    "balance": "167400.00"
  }
  // Include more transactions here...
]

Return only the JSON.`;
console.log(simulatedExtractedText)

  
    setExtractedText(simulatedExtractedText); // Set the simulated text for testing
  
    // Call the Gemini API with the extracted text
    await processText(simulatedExtractedText);
  };

  useEffect(() => {
    if (result) {
      console.log('Received Gemini response:', result);
      try {
        // Extract the JSON part from the response using a regex
        const jsonMatch = result.match(/```json\s*(.*?)\s*```/s);
        
        if (jsonMatch && jsonMatch[1]) {
          const parsedResult = JSON.parse(jsonMatch[1]); // Parse the extracted JSON string
  
          // Assuming parsedResult is an array of transaction objects
          const rows = parsedResult.map(transaction => ({
            clientName: transaction.clientName || '',
            bankName: transaction.bankName || '',
            accountNumber: transaction.accountNumber || '',
            transactionDate: transaction.transactionDate || '',
            creditDebit: transaction.creditDebit || '',
            description: transaction.description || '',
            amount: transaction.amount || '',
            balance: transaction.balance || ''
          }));
  
          setParsedData(rows); // Update the parsed data state
          onUploadData(rows);  // Optionally pass the data to the parent component
        } else {
          console.error("No valid JSON found in the response.");
        }
      } catch (e) {
        console.error("Error parsing JSON result: ", e);
      }
    }
  }, [result]); // Run this effect when 'result' changes
  
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
      {loading && <p className="text-center mt-4">Processing...</p>}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      {result && <p className="mt-4">Gemini Response: {result}</p>}
    </div>
  );
}

export default Upload;

import React, { useState, useEffect } from "react";
import { test } from "../../../backend/controllers/user.controller";
import { ClipLoader } from 'react-spinners';

function Upload({ onUploadData, setExtractedText, processText, loading, result, error }) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [context, setContext] = useState(""); // State to store context
  const [pages, setPages] = useState([]); // State to store pages of text
  const currentRows=[]
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
const [trigger,setTrigger]=useState(0);
const [loadingClip, setLoadingClip] = useState(false);

//   const handleUpload = async (event) => {
//     event.preventDefault();
//     console.log("Uploaded file:", file);

//     const formData = new FormData();
//     formData.append('pdf', file);
//     let response;
//     try {
//       response = await fetch('http://localhost:3000/api/ocr/upload', {
//         method: 'POST',
//         body: formData,
//         credentials: 'include',
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const { pages: extractedPages } = await response.json(); // Expecting an array of pages
//       setPages(extractedPages);
//       console.log(extractedPages);
//       // let extractedData = await response.json();
//       // extractedData = extractedData.text;
//       const simulatedExtractedText = `I have extracted data from an image containing financial transactions, which may include various fields in different formats and irrelevant information. Please analyze the extracted data and identify the relevant financial table, typically including:

// - Client Name
// - Bank Name
// - Account Number
// - Transaction Date (mm/dd/yyyy)
// - Credit/Debit
// - Description
// - Amount
// - Balance

// Focus only on structured data. Here is the new data:

// ${extractedData}

// Here is the context of previous pages (if it exists):
// ${context}

// Now, return the relevant transactions in a structured JSON format like this:

// [
//   {
//     "clientName": "Mr. John Doe",
//     "bankName": "B3 BANK",
//     "accountNumber": "111-234-567-890",
//     "transactionDate": "12/01/2020",
//     "creditDebit": "Credit",
//     "description": "Payment - Credit Card",
//     "amount": "5400.00",
//     "balance": "170400.00"
//   }
//   // Include more transactions here...
// ]

// Return the JSON first then after that provide the most relevant info from the current page.`;
//       console.log(simulatedExtractedText);

//       setExtractedText(simulatedExtractedText);

//       await processText(simulatedExtractedText);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

const handleUpload = async (event) => {
  event.preventDefault();
setLoadingClip(true)
  console.log("Uploaded file:", file);

  const formData = new FormData();
  formData.append('pdf', file);
  let response;
  onUploadData([]);
  let combinedContext = ""; // Initialize a variable to hold the combined context

  try {
    response = await fetch('/api/ocr/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const { pages: extractedPages } = await response.json(); // Expecting an array of pages
    setPages(extractedPages);

    for (const [index, extractedData] of extractedPages.entries()) {
      const simulatedExtractedText = `I have extracted data from an image containing financial transactions, which may include various fields in different formats and irrelevant information. Please analyze the extracted data and identify the relevant financial table, typically including:

      - Client Name
      - Bank Name
      - Account Number
      - Transaction Date (mm/dd/yyyy)
      - Credit/Debit
      - Description
      - Amount
      - Balance
      
      Focus only on structured data. Here is the new data:
      
      ${extractedData}
      
      Here is the context of previous pages (if it exists):
      ${combinedContext}
      
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
      }
      // Include more transactions here...
      ]
      Extract only the bank statement transactions. Dont extract the summaries.
      Return the JSON first then after that provide the most relevant info from the current page thst might be required on the next page. Also just tell where you have left of so that the next page might continue it if data is there.`; 
            console.log(`Processing page ${index + 1}:`, simulatedExtractedText);
      setExtractedText(simulatedExtractedText);
      
      const processedData = await processText(simulatedExtractedText); // Process each page's text
      
      // Wait for handleResult to complete and update combinedContext
      combinedContext = await handleResult(processedData, combinedContext);
    }

    setContext(combinedContext); // Set the final combined context after the loop

  } catch (error) {
    console.error('Error uploading file:', error);
  }finally {
    setLoadingClip(false); // Stop loading animation in both success and error cases
  }
};

// Update handleResult to accept context as an argument and return it
const handleResult = async (result, previousContext) => {
  let newContext = previousContext; // Start with the previous context

  if (result) {
    console.log('Received Gemini response:', result);
    try {
      const jsonMatch = result.match(/```json\s*(.*?)\s*```/s);
      if (jsonMatch && jsonMatch[1]) {
        const parsedResult = JSON.parse(jsonMatch[1]);
        const rows = parsedResult.map(transaction => ({
          clientName: transaction.clientName || '',
          bankName: transaction.bankName || '',
          accountNumber: transaction.accountNumber || '',
          transactionDate: transaction.transactionDate || '',
          creditDebit: transaction.creditDebit || '',
          description: transaction.description || '',
          amount: transaction.amount ? parseFloat(transaction.amount.replace(/,/g, '')) : '', // Remove commas
          balance: transaction.balance ? parseFloat(transaction.balance.replace(/,/g, '')) : '' // Remove commas
        }));

        setParsedData(rows);
        onUploadData(prevData => {
          if (!prevData) return rows; // In case of undefined or null
          return [...prevData, ...rows];
        });

        // Extract relevant info after JSON
        const relevantInfo = result.split('```json')[1]?.split('```')[1]?.trim() || '';
        newContext = previousContext ? `${previousContext}\n${relevantInfo}` : relevantInfo; // Update context
      } else {
        console.error("No valid JSON found in the response.");
      }
    } catch (e) {
      console.error("Error parsing JSON result: ", e);
    }
  }

  return newContext; // Return the updated context
};

//   handleResult(); // Call the async function
// }, [result]);


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
      {!loading&&loadingClip && <p className="text-center mt-4">Processing PDF...</p>}

      {loading &&loadingClip&&   <p className="text-center mt-4">Populating Table...</p>}

      {loadingClip && (
        <div className="flex justify-center mt-4">
          <ClipLoader color="white" loading={loadingClip} size={50} />
        </div>
      )}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      {/* {result && <p className="mt-4">Gemini Response: {result}</p>} */}
    </div>
  );
}

export default Upload;

import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

function Home() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      // backend logic
      console.log("Uploaded data:");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-200">
            Upload PDF
          </h1>
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
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;

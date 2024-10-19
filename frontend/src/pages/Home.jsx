import { useState } from "react";
import Footer from "../components/Footer"
import Header from "../components/Header"

function Home() {
  const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('pdf', file);

        try {
            // backend logic
            console.log('Uploaded data:', data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 ">
      <Header/>
      <div className=' text-3xl flex-1'>Home
        <div>
            <h1>Upload PDF</h1>
            <form onSubmit={handleUpload}>
                <input type="file" accept="application/pdf" onChange={handleFileChange} required />
                <button type="submit">Upload</button>
            </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
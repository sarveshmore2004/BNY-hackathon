import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import { Toaster } from "sonner";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import About from "./pages/About";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import UploadPage from "./pages/UploadPage";
import Dashboard from "./pages/Dashboard";
import {useState} from "react"

export default function App() {
  const [tableData, setTableData] = useState(null); // Store the extracted data for the table
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard tableData={tableData} setTableData={setTableData} />} />
          <Route path="/upload" element={<UploadPage tableData={tableData} setTableData={setTableData} />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}></Route>
        <Route path="*" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

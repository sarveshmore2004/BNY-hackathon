import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import { Toaster } from "sonner";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import About from "./pages/About";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import Posts from "./pages/Posts";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/posts' element={<Posts />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  );
}

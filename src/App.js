import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import './App.css'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Create from "./pages/Create";
import Saved from "./pages/Saved";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className=" h-screen">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/saved" element={<Saved/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/profile/:username" element={<Profile/>} />
        <Route path="/create" element={<Create/>} />
        <Route path="/settings" element={<Settings/>} />
      </Routes>
    </div>
  );
}

export default App;

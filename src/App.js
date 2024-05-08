import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/v1home.js";
import Register from "./pages/v1register.js";
import Login from "./pages/v1login.js";
import Members from "./pages/v1members.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

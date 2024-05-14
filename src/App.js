import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/v1home.js";
import Register from "./pages/v1register.js";
import Login from "./pages/v1login.js";
import Members from "./pages/v1members.js";
import * as SDK from "./sdk_backend_fetch.js";
import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIsAuthenticated = async () => {
      try {
        const authenticated = await SDK.isAuthenticated();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (window.location.pathname === "/members") {
      checkIsAuthenticated();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/members"
          element={
            loading ? null : isAuthenticated ? <Members /> : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

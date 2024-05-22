import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/v1home.js";
import Register from "./pages/v1register.js";
import Login from "./pages/v1login.js";
import Members from "./pages/v1members.js";
import Dashboard from "./pages/v1dashboard.js";
import * as SDK from "./sdk_backend_fetch.js";
import "./index.css";

import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setUserId] = useState(null);

  useEffect(() => {
    const checkIsAuthenticated = async () => {
      try {
        const authenticated = await SDK.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
          const userId = authenticated.id;
          setUserId(userId);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      checkIsAuthenticated();
    } else {
      setLoading(false);
    }
  }, [loading]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/login"
        element={
          <Login
            onLogin={async (userId) => {
              setUserId(userId);
              setIsAuthenticated(true);
            }}
          />
        }
      />
      <Route
        path="/members/:userId/tally"
        element={
          loading ? null : isAuthenticated ? <Members /> : <Navigate to="/" />
        }
      />
      <Route
        path="/members/:userId/dashboard"
        element={
          loading ? null : isAuthenticated ? <Dashboard /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
}

export default App;

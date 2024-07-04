import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import * as SDK from "./sdk_backend_fetch.js";
import Home from "./pages/v1home.js";
import Register from "./pages/v1register.js";
import Login from "./pages/v1login.js";
import Tally from "./pages/v1tally.js";
import Categories from "./pages/v1categories.js";
import Dashboard from "./pages/v1dashboard.js";
import EmailVerification from "./components/emailVerification.js";
import PasswordRecovery from "./pages/v1passwordRecovery.js";
import PasswordReset from "./pages/v1passwordReset.js";
import Profile from "./pages/v1profile.js";
import Pending from "./pages/v1pending.js";
import "./index.css";

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
      <Route path="/verify-email" Component={EmailVerification} />"
      <Route path="/password-recovery" Component={PasswordRecovery} />"
      <Route path="/password-reset" Component={PasswordReset} />"
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
          loading ? null : isAuthenticated ? <Tally /> : <Navigate to="/" />
        }
      />
      <Route
        path="/members/:userId/pending"
        element={
          loading ? null : isAuthenticated ? <Pending /> : <Navigate to="/" />
        }
      />
      <Route
        path="/members/:userId/dashboard"
        element={
          loading ? null : isAuthenticated ? <Dashboard /> : <Navigate to="/" />
        }
      />
      <Route
        path="/members/:userId/categories"
        element={
          loading ? null : isAuthenticated ? (
            <Categories />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/members/:userId/profile"
        element={
          loading ? null : isAuthenticated ? <Profile /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
}

export default App;

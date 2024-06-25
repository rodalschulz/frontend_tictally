import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

import * as SDK from "../sdk_backend_fetch.js";

const EmailVerification = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const hasVerified = useRef(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token && !hasVerified.current) {
      hasVerified.current = true;
      verifyEmails(token);
    }
  }, [location.search]);

  const verifyEmails = async (token) => {
    try {
      console.log("Verifying email");
      const response = await SDK.verifyEmail(token);
      setMessage(response.response);
    } catch (error) {
      console.error("Error verifying email:", error);
      setMessage("Error verifying email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Email Verification
          </h1>
        </div>
        {isLoading ? (
          <FaSpinner className="animate-spin h-6 w-6 text-blue-600" />
        ) : (
          <p>{message}</p>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;

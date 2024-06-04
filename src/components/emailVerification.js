import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as SDK from "../sdk_backend_fetch.js";

const EmailVerification = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      verifyEmails(token);
    }
  }, [location]);

  const verifyEmails = async (token) => {
    try {
      const response = await SDK.verifyEmail(token);
      setMessage(response.response);
    } catch (error) {
      console.error("Error verifying email:", error);
      setMessage("Error verifying email");
    }
  };
};

export default EmailVerification;

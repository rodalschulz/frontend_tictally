import React, { useState } from "react";
import * as SDK from "../sdk_backend_fetch.js";
import { useParams } from "react-router-dom";

const UploadCSV = () => {
  const { userId } = useParams();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await SDK.uploadCSV(userId, formData);
      setMessage(response.message);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong!");
    } finally {
      setFile(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleFileUpload}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload CSV</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadCSV;

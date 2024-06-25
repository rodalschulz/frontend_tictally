import React, { useState } from "react";
import { useParams } from "react-router-dom";

import * as SDK from "../sdk_backend_fetch.js";

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
        <div className="flex">
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="btn bg-custom-databg btn-sm mr-2 w-10 border-gray-800 hover:bg-primary text-white"
          >
            File
          </label>

          <button
            type="submit"
            className="btn bg-custom-databg btn-sm w-20 border-gray-800 hover:bg-primary text-white"
          >
            Upload
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadCSV;

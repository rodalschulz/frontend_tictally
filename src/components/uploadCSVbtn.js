import React, { useState } from "react";
import * as SDK from "../sdk_backend_fetch.js";
import { useParams } from "react-router-dom";

const UploadCSVbtn = () => {
  const { userId } = useParams();
  const [file, setFile] = useState(null);
  const [, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await SDK.uploadCSV(userId, formData);
      alert(response.message);
      setMessage(response.message);
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
      setMessage("Something went wrong!");
    } finally {
      setFile(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleFileUpload}>
        <div className="flex items-center">
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className={`btn btn-sm w-8 border-gray-800 text-white ${
              file
                ? "bg-primary text-white font-bold border-white text-[20px]"
                : "bg-custom-databg"
            } hover:bg-primary rounded-r-none`}
          >
            F
          </label>
          <div className="h-full w-0.5 bg-gray-800"></div>
          <button
            type="submit"
            className="btn bg-custom-databg btn-sm w-20 border-gray-800 hover:bg-primary text-white rounded-l-none mr-2"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadCSVbtn;

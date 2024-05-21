import React, { useState } from "react";

const UploadCSV = () => {
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
      const response = await fetch("/upload-csv", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file");
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

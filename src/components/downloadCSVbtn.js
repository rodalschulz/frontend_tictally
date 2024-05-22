import React from "react";
import * as SDK from "../sdk_backend_fetch.js";

const DownloadCSV = ({ userId }) => {
  const downloadCSV = async () => {
    try {
      const response = await SDK.downloadCSV(userId);
      //   const url = window.URL.createObjectURL(new Blob([response]));
      //   const link = document.createElement("a");
      //   link.href = url;
      //   link.setAttribute("download", `user_${userId}_data.csv`);
      //   document.body.appendChild(link);
      //   link.click();
      //   document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  return (
    <button onClick={downloadCSV} className="btn btn-primary">
      Download CSV
    </button>
  );
};

export default DownloadCSV;

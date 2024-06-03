import React from "react";
import * as SDK from "../sdk_backend_fetch.js";
import { FaCloudDownloadAlt } from "react-icons/fa";

const DownloadCSV = ({ userId }) => {
  const downloadCSV = async () => {
    try {
      await SDK.downloadCSV(userId);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  return (
    <button
      onClick={downloadCSV}
      className="btn bg-custom-databg btn-sm mr-5 w-10 border-gray-800 hover:bg-primary"
    >
      <FaCloudDownloadAlt />
    </button>
  );
};

export default DownloadCSV;

import React from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";

import * as SDK from "../sdk_backend_fetch.js";

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
      className="btn bg-custom-databg btn-sm mr-5 w-10 border-zinc-800 hover:bg-primary"
    >
      <FaCloudDownloadAlt />
    </button>
  );
};

export default DownloadCSV;

import React, { useState } from "react";
import {
  FaFileDownload,
  FaRegChartBar,
  FaTable,
  FaSignOutAlt,
  FaRegQuestionCircle,
} from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import {
  MdDeleteForever,
  MdOutlinePlaylistAdd,
  MdAlarmOn,
} from "react-icons/md";
import SidebarButton from "../baseComponents/sidebarButton";
import * as SDK from "../sdk_backend_fetch";

const Sidebar = ({
  userId,
  isMobile,
  submit,
  remove,
  displayInstructions,
  setDisplayInstructions,
}) => {
  // NAVIGATION
  const navigateDashboard = () => {
    window.location.href = `/members/${userId}/dashboard`;
  };
  const navigateTally = () => {
    window.location.href = `/members/${userId}/tally`;
  };
  const navigateCategories = () => {
    window.location.href = `/members/${userId}/categories`;
  };
  const navigatePending = () => {
    window.location.href = `/members/${userId}/pending`;
  };

  // OTHERS
  const displayInstructionsHandler = () => {
    setDisplayInstructions(!displayInstructions);
  };

  const logOut = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const downloadCSV = async () => {
    try {
      await SDK.downloadCSV(userId);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-300 absolute">
      <div className="sm:relative bg-custom-grey text-white flex flex-col">
        <div className="flex-grow space-y-4 mt-4 p-2">
          <SidebarButton onClick={navigateDashboard} icon={<FaRegChartBar />} />
          <SidebarButton onClick={navigateTally} icon={<FaTable />} />
          <SidebarButton onClick={navigateCategories} icon={<GrConfigure />} />
          <SidebarButton onClick={navigatePending} icon={<MdAlarmOn />} />
        </div>
        <div className="flex-grow space-y-4 mt-4 p-2">
          {isMobile && (
            <>
              <SidebarButton
                onClick={submit}
                icon={<MdOutlinePlaylistAdd />}
                bgColor={"bg-gray-700"}
              />
              <SidebarButton
                onClick={remove}
                icon={<MdDeleteForever />}
                bgColor={"bg-gray-700"}
              />
              <SidebarButton
                onClick={downloadCSV}
                icon={<FaFileDownload />}
                bgColor={"bg-gray-700"}
              />
            </>
          )}
        </div>
        <div className="space-y-4 mt-auto p-2 xs:mb-20 sm:mb-0">
          <SidebarButton
            onClick={displayInstructionsHandler}
            icon={<FaRegQuestionCircle />}
          />
          <SidebarButton onClick={logOut} icon={<FaSignOutAlt />} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

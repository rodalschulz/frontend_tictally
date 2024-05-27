import React, { useState } from "react";
import { FaRegChartBar, FaList, FaTags, FaSignOutAlt } from "react-icons/fa";
import useDelayedText from "../baseComponents/useDelayedText";
import SidebarButton from "../baseComponents/sidebarButton";

const Sidebar = ({ userId }) => {
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

  const logOut = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-gray-300 absolute">
      <div className="sm:relative bg-custom-grey text-white flex flex-col">
        <div className="flex-grow space-y-4 mt-4 p-2">
          <SidebarButton onClick={navigateDashboard} icon={<FaRegChartBar />} />
          <SidebarButton onClick={navigateTally} icon={<FaList />} />
          <SidebarButton onClick={navigateCategories} icon={<FaTags />} />
        </div>
        <div className="space-y-4 mt-auto p-2 xs:mb-20 sm:mb-0">
          <SidebarButton onClick={logOut} icon={<FaSignOutAlt />} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

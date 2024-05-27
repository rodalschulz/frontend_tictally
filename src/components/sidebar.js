import React, { useState } from "react";
import { FaRegChartBar, FaList, FaTags, FaSignOutAlt } from "react-icons/fa";
import useDelayedText from "../baseComponents/useDelayedText";
import SidebarButton from "../baseComponents/sidebarButton";

const Sidebar = ({ userId }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const showText = useDelayedText(showSidebar);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

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
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      <div
        className={`xs:absolute sm:relative xs:h-screen ${
          showSidebar ? "w-36 px-2" : "w-16 px-2"
        } bg-custom-grey text-white flex flex-col transition-width duration-300 ease-in-out`}
      >
        <div className="flex-grow space-y-4 mt-4">
          <SidebarButton
            showSidebar={showSidebar}
            showText={showText}
            onClick={navigateDashboard}
            icon={<FaRegChartBar />}
            text="Dashboard"
          />
          <SidebarButton
            showSidebar={showSidebar}
            showText={showText}
            onClick={navigateTally}
            icon={<FaList />}
            text="My Tally"
          />
          <SidebarButton
            showSidebar={showSidebar}
            showText={showText}
            onClick={navigateCategories}
            icon={<FaTags />}
            text="Categories"
          />
        </div>
        <SidebarButton
          showSidebar={showSidebar}
          showText={showText}
          onClick={logOut}
          icon={<FaSignOutAlt />}
          text="Log Out"
        />
      </div>
      <button
        onClick={toggleSidebar}
        className="bg-gray-800 text-white text-sm px-1 py-2 h-10 rounded-none mt-4 rounded-tr-md rounded-br-md z-50"
      >
        {showSidebar ? "<" : ">"}
      </button>
    </div>
  );
};

export default Sidebar;

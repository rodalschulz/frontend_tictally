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

import * as SDK from "../sdk_backend_fetch";
import SidebarButton from "../hooks/sidebarButton.js";
import useFetchPendingTasks from "../hooks/useFetchPendingTasks.js";

const Sidebar = ({
  userId,
  isMobile,
  submit,
  remove,
  displayInstructions,
  setDisplayInstructions,
  showSidebar,
  setShowSidebar,
}) => {
  const [loading, setIsLoading] = useState(false);

  // PENDING TASKS
  const { pendingTasks } = useFetchPendingTasks(userId, 365, setIsLoading);
  const currentYear = new Date().getFullYear();
  const daysForward = 14;
  const nowStart = new Date();
  nowStart.setDate(nowStart.getDate() - 1);
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + daysForward);
  const pendingTasksMod = pendingTasks.map((task) => {
    if (task.recurring) {
      let date = new Date(task.date);
      date.setFullYear(currentYear);
      task.date = date.toISOString();
    }
    return task;
  });
  const upcoming = pendingTasksMod.filter(
    (task) =>
      task.date &&
      !task.state &&
      new Date(task.date) >= nowStart &&
      new Date(task.date) <= futureDate
  );
  const closeUpcoming = upcoming.filter((task) => new Date(task.date) < now);

  // NAVIGATION
  const navigateDashboard = (e) => {
    e.stopPropagation();
    window.location.href = `/members/${userId}/dashboard`;
  };
  const navigateTally = (e) => {
    e.stopPropagation();
    window.location.href = `/members/${userId}/tally`;
  };
  const navigateCategories = (e) => {
    e.stopPropagation();
    window.location.href = `/members/${userId}/categories`;
  };
  const navigatePending = (e) => {
    e.stopPropagation();
    window.location.href = `/members/${userId}/pending`;
  };

  // OTHERS
  const displayInstructionsHandler = (e) => {
    e.stopPropagation();
    setDisplayInstructions(!displayInstructions);
  };

  const logOut = async (e) => {
    e.stopPropagation();
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const downloadCSV = async (e) => {
    e.stopPropagation();
    try {
      await SDK.downloadCSV(userId);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const hideSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <>
      {showSidebar && (
        <div className="flex h-screen bg-gray-300 absolute z-50">
          <div
            onClick={hideSidebar}
            className="sm:relative bg-secondary text-white flex flex-col"
          >
            <div className="flex-grow space-y-4 mt-4 p-2">
              <SidebarButton onClick={navigateTally} icon={<FaTable />} />
              <SidebarButton
                onClick={navigateDashboard}
                icon={<FaRegChartBar />}
              />
              <SidebarButton
                onClick={navigateCategories}
                icon={<GrConfigure />}
              />
              <SidebarButton
                onClick={navigatePending}
                icon={<MdAlarmOn />}
                bgColor={closeUpcoming.length > 0 ? "bg-custom-upcoming" : null}
              />
            </div>
            <div className="flex-grow space-y-4 mt-4 p-2">
              {isMobile && (
                <>
                  <SidebarButton
                    onClick={submit}
                    icon={<MdOutlinePlaylistAdd />}
                    bgColor={"bg-gray-400"}
                  />
                  <SidebarButton
                    onClick={remove}
                    icon={<MdDeleteForever />}
                    bgColor={"bg-gray-900"}
                  />
                  <SidebarButton
                    onClick={downloadCSV}
                    icon={<FaFileDownload />}
                    bgColor={"bg-gray-700"}
                  />
                </>
              )}
            </div>
            <div className="space-y-4 mt-auto p-2 xs:mb-20 sm:mb-4">
              <SidebarButton
                onClick={displayInstructionsHandler}
                icon={<FaRegQuestionCircle className="text-cyan-200" />}
              />
              <SidebarButton onClick={logOut} icon={<FaSignOutAlt />} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

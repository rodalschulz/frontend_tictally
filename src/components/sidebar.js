import React, { useEffect, useState } from "react";
import {
  FaFileDownload,
  FaRegChartBar,
  FaTable,
  FaSignOutAlt,
  FaRegQuestionCircle,
} from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { GrConfigure } from "react-icons/gr";
import {
  MdDeleteForever,
  MdOutlinePlaylistAdd,
  MdAlarmOn,
} from "react-icons/md";

import * as SDK from "../sdk_backend_fetch";
import SidebarButton from "../hooks/sidebarButton.js";
import useFetchPendingTasks from "../hooks/useFetchPendingTasks.js";
import useCurrTimeData from "../hooks/useCurrTimeData.js";
import datetimeFnc from "../utils/datetimeUtl.js";

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
  const [upcoming, setUpcoming] = useState([]);
  const [closeUpcoming, setCloseUpcoming] = useState([]);
  const [adhoc, setAdhoc] = useState([]);
  const [assistMsg, setAssistMsg] = useState("");
  const [showAssistMsg, setShowAssistMsg] = useState(false); // Add this state to handle the fade-in/out

  // PENDING TASKS
  const { pendingTasks } = useFetchPendingTasks(userId, 365, setIsLoading);
  const { nowStart, now, futureDate } = useCurrTimeData();

  useEffect(() => {
    const storedHour = localStorage.getItem("lastMsgHour");
    const storedDay = localStorage.getItem("lastMsgDay");
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentDay = currentDate.getDay();
    if (parseInt(storedHour) !== parseInt(currentHour)) {
      localStorage.setItem("lastMsgHour", currentHour);
      localStorage.removeItem("closeUpcoming");
    }
    if (parseInt(storedDay) !== parseInt(currentDay)) {
      localStorage.setItem("lastMsgDay", currentDay);
      localStorage.removeItem("upcoming");
      localStorage.removeItem("adhoc");
    }

    if (pendingTasks.length > 0) {
      const upcomingTasks = pendingTasks.filter(
        (task) =>
          task.date &&
          !task.state &&
          new Date(task.date) >= nowStart &&
          new Date(task.date) <= futureDate
      );
      const closeUpcomingTasks = upcomingTasks.filter(
        (task) => new Date(task.date) < now
      );
      const adhocTasks = pendingTasks.filter(
        (task) => !task.date && !task.state
      );
      setCloseUpcoming(closeUpcomingTasks);
      setUpcoming(upcomingTasks);
      setAdhoc(adhocTasks);

      const upcomingShowed = localStorage.getItem("upcoming");
      const closeUpcomingShowed = localStorage.getItem("closeUpcoming");
      const adhocShowed = localStorage.getItem("adhoc");
      if (closeUpcomingTasks.length > 0 && !closeUpcomingShowed) {
        setTimeout(() => {
          setAssistMsg("closeUpcoming");
          setTimeout(() => {
            setShowAssistMsg(true);
          }, 1000);
        }, 9000);
      } else if (upcomingTasks.length > 0 && !upcomingShowed) {
        setTimeout(() => {
          setAssistMsg("upcoming");
          setTimeout(() => {
            setShowAssistMsg(true);
          }, 1000);
        }, 9000);
      } else if (adhocTasks.length > 0 && !adhocShowed) {
        setTimeout(() => {
          setAssistMsg("adhoc");
          setTimeout(() => {
            setShowAssistMsg(true);
          }, 1000);
        }, 9000);
      }
    }
  }, [pendingTasks]);

  const closePopup = () => {
    setShowAssistMsg(false);
    setTimeout(() => {
      setAssistMsg("");
    }, 1000);
    localStorage.setItem(assistMsg, "true");
  };

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
  const navigateProfile = (e) => {
    e.stopPropagation();
    window.location.href = `/members/${userId}/profile`;
  };

  // OTHERS
  const displayInstructionsHandler = (e) => {
    e.stopPropagation();
    setDisplayInstructions(!displayInstructions);
  };

  const logOut = async (e) => {
    e.stopPropagation();
    localStorage.removeItem("token");
    localStorage.removeItem("selectedCategories");
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
        <div>
          {assistMsg && (
            <div
              className={`z-50 absolute ml-20 text-xs bottom-3 text-white bg-slate-800 p-2 rounded-md w-[18rem] 
        ${showAssistMsg ? "opacity-100" : "opacity-0"} 
        transition-opacity duration-1000 ease-in-out`}
              onClick={() => closePopup()}
            >
              <p className="text-center mb-2 text-sm font-bold">REMINDER!</p>
              <p className="mb-2 text-xs">
                {assistMsg === "closeUpcoming"
                  ? "You have really close appointments:"
                  : assistMsg === "upcoming"
                  ? "You have upcoming appointments: "
                  : assistMsg === "adhoc"
                  ? "You have pending ad-hoc tasks: "
                  : null}
              </p>
              {assistMsg === "closeUpcoming"
                ? closeUpcoming.map((appoint) => (
                    <p key={appoint.id} className="text-[0.7rem]">
                      {" "}
                        - {datetimeFnc.getDDMMYYYY(
                        appoint.date.slice(0, 10)
                      )} |{" "}
                      {appoint.description.length < 39
                        ? appoint.description
                        : appoint.description.slice(0, 40) + " ..."}
                    </p>
                  ))
                : assistMsg === "upcoming"
                ? upcoming.map((appoint) => (
                    <p key={appoint.id} className="text-[0.7rem]">
                      {" "}
                        - {datetimeFnc.getDDMMYYYY(
                        appoint.date.slice(0, 10)
                      )} |{" "}
                      {appoint.description.length < 39
                        ? appoint.description
                        : appoint.description.slice(0, 40) + " ..."}
                    </p>
                  ))
                : assistMsg === "adhoc"
                ? adhoc.map((appoint) => (
                    <p key={appoint.id} className="text-[0.7rem]">
                        -{" "}
                      {appoint.description.length < 39
                        ? appoint.description
                        : appoint.description.slice(0, 40) + " ..."}
                    </p>
                  ))
                : null}
            </div>
          )}
          <div className="flex h-screen bg-gray-300 absolute z-50 hover:cursor-pointer">
            <div
              onClick={hideSidebar}
              className="sm:relative bg-secondary text-white flex flex-col"
            >
              <div className="flex flex-col justify-center items-center mt-1 text-custom-lightblue">
                <div className="text-[11px]">Beta</div>
                <div className="text-[11px]">v1.2.0</div>
              </div>
              <div className="flex-grow space-y-4  p-2">
                <SidebarButton
                  onClick={navigateTally}
                  icon={<FaTable />}
                  label={"Tally"}
                />
                <SidebarButton
                  onClick={navigateDashboard}
                  icon={<FaRegChartBar />}
                  label={"Dashboard"}
                />
                <SidebarButton
                  onClick={navigateCategories}
                  icon={<GrConfigure />}
                  label={"Configuration"}
                />
                <SidebarButton
                  onClick={navigatePending}
                  icon={<MdAlarmOn />}
                  label={"Pending"}
                  bgColor={closeUpcoming.length > 0 ? "bg-yellow-500" : null}
                  bgHoverColor={
                    closeUpcoming.length > 0 ? "hover:bg-yellow-200" : null
                  }
                />
                <SidebarButton
                  onClick={navigateProfile}
                  icon={<IoPersonOutline />}
                  label={"Profile"}
                />
              </div>
              <div className="flex-grow space-y-4 mt-4 p-2">
                {isMobile && (
                  <>
                    <SidebarButton
                      onClick={submit}
                      icon={<MdOutlinePlaylistAdd />}
                      bgColor={"bg-gray-400"}
                      label={"Enter"}
                    />
                    <SidebarButton
                      onClick={remove}
                      icon={<MdDeleteForever />}
                      bgColor={"bg-gray-900"}
                      label={"Delete"}
                    />
                    <SidebarButton
                      onClick={downloadCSV}
                      icon={<FaFileDownload />}
                      bgColor={"bg-gray-700"}
                      label={"Download CSV"}
                    />
                  </>
                )}
              </div>
              <div className="space-y-4 mt-auto p-2 xs:mb-20 sm:mb-4">
                <SidebarButton
                  onClick={displayInstructionsHandler}
                  icon={<FaRegQuestionCircle className="text-cyan-200" />}
                  label={"Instructions"}
                />
                <SidebarButton
                  onClick={logOut}
                  icon={<FaSignOutAlt />}
                  label={"Log out"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

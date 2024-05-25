import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as SDK from "../sdk_backend_fetch.js";

import StackedBarChart from "../components/stackedBarChart";
import TrailingDataCard from "../components/trailingDataCard";

const Dashboard = () => {
  const { userId } = useParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const [userActivityData, setUserActivityData] = useState([]);

  const [coreLimits, setCoreLimits] = useState({});

  // FETCH CATEGORY CONFIG
  useEffect(() => {
    const fetchCategoryConfig = async () => {
      try {
        const response = await SDK.getUserCategoryConfig(userId);
        const coreLimits = response.user.categConfig.coreLimits;
        setCoreLimits(coreLimits);
      } catch (error) {
        console.error("Error fetching user category config:", error);
      }
    };

    fetchCategoryConfig();
  }, [userId]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const fetchUserActivityData = async () => {
    const totalEntries = 1500;
    try {
      const data = await SDK.getUserActivityData(userId, totalEntries);
      setUserActivityData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserActivityData();
  }, [userId]);

  const logOut = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // NAVIGATION
  // const navigateDashboard = () => {
  //   window.location.href = `/members/${userId}/dashboard`;
  // };
  const navigateCategories = () => {
    window.location.href = `/members/${userId}/categories`;
  };
  const navigateTally = () => {
    window.location.href = `/members/${userId}/tally`;
  };

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      {showSidebar && (
        <nav className="xs:absolute sm:relative xs:h-screen w-36 bg-custom-grey text-white p-4 flex flex-col space-y-4">
          <button className="btn btn-primary">Dashboard</button>
          <button className="btn btn-primary" onClick={navigateTally}>
            My Tally
          </button>
          <button className="btn btn-primary" onClick={navigateCategories}>
            Categories
          </button>
          <button className="btn btn-primary">Pending</button>
          <button className="btn btn-primary">Collabs</button>
          <button className="btn btn-primary" onClick={logOut}>
            Log Out
          </button>
        </nav>
      )}
      <button
        onClick={toggleSidebar}
        className="bg-gray-800 text-white text-sm px-1 py-2 h-10 rounded-none mt-4 rounded-tr-md rounded-br-md z-50"
      >
        {showSidebar ? ">" : "<"}
      </button>
      <main className="flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2">
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white mr-5 justify-between items-center">
          Dashboard
        </h1>

        <div className="flex flex-grow">
          <div
            className="w-full max-w-6xl p-2 bg-custom-grey rounded-lg shadow-md h-[75vh]"
            style={{ minHeight: "500px" }}
          >
            <StackedBarChart
              userActivityData={userActivityData}
              coreLimits={coreLimits}
            />
          </div>
          <div className="ml-2">
            <TrailingDataCard
              userActivityData={userActivityData}
              coreLimits={coreLimits}
              categories={["WORK", "LEARN", "BUILD"]}
              timeframe={30}
            />
          </div>
          <div className="ml-2">
            <TrailingDataCard
              userActivityData={userActivityData}
              coreLimits={coreLimits}
              categories={["WORK"]}
              timeframe={30}
            />
          </div>
          <div className="ml-2">
            <TrailingDataCard
              userActivityData={userActivityData}
              coreLimits={coreLimits}
              categories={["WORK", "LEARN", "BUILD"]}
              timeframe={7}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

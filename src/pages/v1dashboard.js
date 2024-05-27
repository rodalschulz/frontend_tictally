import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as SDK from "../sdk_backend_fetch.js";

import StackedBarChart from "../components/stackedBarChart";
import TrailingDataCard from "../components/trailingDataCard";

import Sidebar from "../components/sidebar.js";

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

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      <Sidebar userId={userId} />
      <main className="flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2 ml-16">
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white mr-5 justify-between items-center">
          Dashboard
        </h1>

        <div className="flex flex-grow">
          <div
            className="w-full max-w-6xl p-2 bg-custom-grey rounded-lg shadow-md h-[75vh] xs:min-w-full sm:min-w-0"
            style={{ minHeight: "500px" }}
          >
            <StackedBarChart
              userActivityData={userActivityData}
              coreLimits={coreLimits}
            />
          </div>
          <div>
            <div className="bg-secondary rounded-lg ml-2 mb-2 text-white font-bold text-center">
              <h2>TRAILING</h2>
            </div>
            <div className="ml-2 mb-2">
              <TrailingDataCard
                userActivityData={userActivityData}
                coreLimits={coreLimits}
                categories={["WORK", "LEARN", "BUILD"]}
                timeframe={30}
              />
            </div>
            <div className="ml-2 mb-2">
              <TrailingDataCard
                userActivityData={userActivityData}
                coreLimits={coreLimits}
                categories={["WORK"]}
                timeframe={30}
              />
            </div>
            <div className="ml-2 mb-2">
              <TrailingDataCard
                userActivityData={userActivityData}
                coreLimits={coreLimits}
                categories={["WORK", "LEARN", "BUILD"]}
                timeframe={7}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

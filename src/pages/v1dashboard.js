import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdMenuOpen } from "react-icons/md";

import StackedBarChart from "../components/stackedBarChart";
import TrailingDataCard from "../components/trailingDataCard";
import PeriodTimesTable from "../components/periodTimesTable";
import Sidebar from "../components/sidebar.js";
import Instructions from "../components/instructions.js";
import ProgressBar from "../components/progressBar.js";
import VitalsBars from "../components/vitalsBars.js";
import useFetchCategoryConfig from "../hooks/useFetchCategoryConfig.js";
import useUserActivityData from "../hooks/useFetchActivityData.js";
import useFetchSubcatResults from "../hooks/useFetchSubcatResults.js";
import useCalculatePeriodTimes from "../hooks/useCalculatePeriodTimes.js";

const Dashboard = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [displayInstructions, setDisplayInstructions] = useState(false);

  const { coreLimits } = useFetchCategoryConfig(userId);
  const { userActivityData } = useUserActivityData(userId, 185, setIsLoading);
  const { subcatResults } = useFetchSubcatResults(userId);

  const [showTable, setShowTable] = useState(false);
  const [showTable7D, setShowTable7D] = useState(false);
  const [showTable30D, setShowTable30D] = useState(false);

  const showTableHandler = () => {
    setShowTable(!showTable);
    setShowTable30D(!showTable30D);
  };

  const showTableHandler2 = () => {
    setShowTable(!showTable);
    setShowTable7D(!showTable7D);
  };

  const periodTimes30D = useCalculatePeriodTimes(
    30,
    coreLimits,
    userActivityData
  );
  const periodTimes7D = useCalculatePeriodTimes(
    7,
    coreLimits,
    userActivityData
  );
  console.log("periodTimes7D", periodTimes7D);

  const openSidebar = () => {
    setShowSidebar(true);
  };

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      <div className="absolute z-50 mt-[50vh] bg-secondary text-white rounded-r-md">
        {!showSidebar && (
          <button className="ml-1 mt-1" onClick={openSidebar}>
            <MdMenuOpen />
          </button>
        )}
      </div>
      <Sidebar
        userId={userId}
        displayInstructions={displayInstructions}
        setDisplayInstructions={setDisplayInstructions}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      <main
        className={`flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2 xs:max-w-full sm:max-w-[2000px] ${
          showSidebar && "ml-16"
        }`}
      >
        <h1 className="sm:min-w-[1400px] xs:w-[1300px] sm:w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white mr-5 justify-between items-center">
          Dashboard
        </h1>
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-100 p-4 rounded-lg shadow-lg flex items-center justify-center">
              <FaSpinner className="text-4xl text-primary animate-spin" />
            </div>
          </div>
        )}
        {!isLoading &&
          (userActivityData.length === 0 || displayInstructions) && (
            <Instructions pageName="dashboard" />
          )}
        <div className="flex flex-grow xs:w-[1300px] sm:w-full">
          <div
            className="w-full bg-custom-grey rounded-lg xs:h-[570px] sm:h-[80vh] xs:min-w-[800px] sm:min-w-[70vw] p-1.5"
            style={{ minHeight: "500px" }}
          >
            <StackedBarChart
              userActivityData={userActivityData}
              coreLimits={coreLimits}
            />
          </div>
          {!showTable && !showTable30D && !showTable7D ? (
            <div className="flex ml-2 w-[550px] max-h-[570px] overflow-y-scroll sm:w-full sm:min-h-[80vh] xs:h-[570px]">
              <div className="w-full" onClick={showTableHandler}>
                <div className="bg-secondary rounded-lg mb-2 text-white font-bold text-center">
                  <h2>LAST 30 DAYS</h2>
                </div>
                <div className="mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes30D}
                    categories={["WORK", "LEARN", "BUILD"]}
                  />
                </div>
                <div className="mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes30D}
                    categories={["WORK"]}
                  />
                </div>
                <div className="mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes30D}
                    categories={["LEARN"]}
                  />
                </div>
                <div className="mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes30D}
                    categories={["BUILD"]}
                  />
                </div>
                <div className="mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes30D}
                    categories={["GENERAL"]}
                  />
                </div>
                <div className="mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes30D}
                    categories={["RECOVERY"]}
                  />
                </div>
                <div className="mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes30D}
                    categories={["CORE"]}
                  />
                </div>
                <div className="mb-2" onClick={console.log()}>
                  <TrailingDataCard
                    periodTimes={periodTimes30D}
                    categories={["WASTE"]}
                  />
                </div>
              </div>
              <div className="w-full mr-2" onClick={showTableHandler2}>
                <div className="bg-secondary rounded-lg ml-2 mb-2 text-white font-bold text-center">
                  <h2>LAST 7 DAYS</h2>
                </div>
                <div className="ml-2 mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes7D}
                    categories={["WORK", "LEARN", "BUILD"]}
                  />
                </div>
                <div className="ml-2 mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes7D}
                    categories={["WORK"]}
                  />
                </div>
                <div className="ml-2 mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes7D}
                    categories={["LEARN"]}
                  />
                </div>
                <div className="ml-2 mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes7D}
                    categories={["BUILD"]}
                  />
                </div>
                <div className="ml-2 mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes7D}
                    categories={["GENERAL"]}
                  />
                </div>
                <div className="ml-2 mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes7D}
                    categories={["RECOVERY"]}
                  />
                </div>
                <div className="ml-2 mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes7D}
                    categories={["CORE"]}
                  />
                </div>
                <div className="ml-2 mb-2">
                  <TrailingDataCard
                    periodTimes={periodTimes7D}
                    categories={["WASTE"]}
                  />
                </div>
              </div>
            </div>
          ) : (
            {
              ...(showTable && showTable30D ? (
                <div
                  className="flex ml-2 xs:w-[550px] sm:w-full xs:max-h-[570px] sm:min-h-[80vh] overflow-auto"
                  onClick={showTableHandler}
                >
                  <PeriodTimesTable
                    periodTimes={periodTimes30D}
                    timeframe={"30D"}
                    title={"Last 30 Days"}
                  />
                </div>
              ) : (
                <div
                  className="flex ml-2 xs:w-[550px] sm:w-full xs:max-h-[570px] sm:min-h-[80vh] overflow-auto xs:h-[570px]"
                  onClick={showTable7D ? showTableHandler2 : showTableHandler}
                >
                  <PeriodTimesTable
                    periodTimes={periodTimes7D}
                    timeframe={"7D"}
                    title={"Last 7 Days"}
                  />
                </div>
              )),
            }
          )}
        </div>
        <div className="mt-1 py-2 xs:w-[1293px] sm:w-full">
          {subcatResults &&
            Object.entries(subcatResults).map(([subcat, minutes]) => (
              <ProgressBar key={subcat} subcat={subcat} minutes={minutes} />
            ))}
        </div>
        <div className="w-fit">
          <VitalsBars periodTimes={periodTimes7D} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

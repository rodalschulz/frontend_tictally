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
import VitalsBars2 from "../components/vitalsBars2.js";
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

  const openSidebar = () => {
    setShowSidebar(true);
  };

  return (
    <div className="flex h-screen bg-zinc-950 overflow-x-auto">
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
        className={`sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2 w-[130rem] ${
          showSidebar && "ml-16"
        }`}
      >
        <h1 className="text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white items-center">
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
        <div className="flex max-h-[80vh]">
          <div
            className="bg-black rounded-md p-1 flex-[3]"
            style={{ minHeight: "500px", minWidth: "850px" }}
          >
            <StackedBarChart
              userActivityData={userActivityData}
              coreLimits={coreLimits}
            />
          </div>
          <div className="flex-col flex-[1]">
            <div>
              {!showTable && !showTable30D && !showTable7D ? (
                <div className="flex ml-2 overflow-y-scroll max-h-[50vh]">
                  <div
                    className="w-full mr-2 px-1 py-1 rounded-lg hover:bg-zinc-700 hover:cursor-pointer h-full"
                    onClick={showTableHandler}
                  >
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
                  <div
                    className="w-full mr-2 px-1 py-1 rounded-lg hover:bg-zinc-700 hover:cursor-pointer h-full"
                    onClick={showTableHandler2}
                  >
                    <div className="bg-secondary rounded-lg mb-2 text-white font-bold text-center">
                      <h2>LAST 7 DAYS</h2>
                    </div>
                    <div className="mb-2">
                      <TrailingDataCard
                        periodTimes={periodTimes7D}
                        categories={["WORK", "LEARN", "BUILD"]}
                      />
                    </div>
                    <div className="mb-2">
                      <TrailingDataCard
                        periodTimes={periodTimes7D}
                        categories={["WORK"]}
                      />
                    </div>
                    <div className="mb-2">
                      <TrailingDataCard
                        periodTimes={periodTimes7D}
                        categories={["LEARN"]}
                      />
                    </div>
                    <div className="mb-2">
                      <TrailingDataCard
                        periodTimes={periodTimes7D}
                        categories={["BUILD"]}
                      />
                    </div>
                    <div className="mb-2">
                      <TrailingDataCard
                        periodTimes={periodTimes7D}
                        categories={["GENERAL"]}
                      />
                    </div>
                    <div className="mb-2">
                      <TrailingDataCard
                        periodTimes={periodTimes7D}
                        categories={["RECOVERY"]}
                      />
                    </div>
                    <div className="mb-2">
                      <TrailingDataCard
                        periodTimes={periodTimes7D}
                        categories={["CORE"]}
                      />
                    </div>
                    <div className="mb-2">
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
                      className="ml-2 overflow-auto max-h-[50vh] hover:cursor-pointer"
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
                      className="ml-2 overflow-auto max-h-[50vh] hover:cursor-pointer"
                      onClick={
                        showTable7D ? showTableHandler2 : showTableHandler
                      }
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
            <div className="ml-2 mt-2 max-h-[30vh] h-full pb-2.5">
              <VitalsBars2 periodTimes={periodTimes7D} />
            </div>
          </div>
        </div>
        <div className="mt-1 py-2">
          {subcatResults &&
            Object.entries(subcatResults).map(([subcat, minutes]) => (
              <ProgressBar key={subcat} subcat={subcat} minutes={minutes} />
            ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

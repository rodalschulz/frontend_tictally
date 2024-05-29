import { useParams } from "react-router-dom";

import StackedBarChart from "../components/stackedBarChart";
import TrailingDataCard from "../components/trailingDataCard";
import useFetchCategoryConfig from "../baseComponents/useFetchCategoryConfig.js";
import useUserActivityData from "../baseComponents/useUserActivityData.js";

import PeriodTimesTable from "../components/periodTimesTable";

import Sidebar from "../components/sidebar.js";
import useCalculatePeriodTimes from "../baseComponents/useCalculatePeriodTimes.js";

const Dashboard = () => {
  const { userId } = useParams();
  const { coreLimits } = useFetchCategoryConfig(userId);
  const { userActivityData } = useUserActivityData(userId, 1500);

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
              <h2>TRAILING - 30D</h2>
            </div>
            <div className="ml-2 mb-2">
              <TrailingDataCard
                periodTimes={periodTimes30D}
                categories={["WORK", "LEARN", "BUILD"]}
              />
            </div>
            <div className="ml-2 mb-2">
              <TrailingDataCard
                periodTimes={periodTimes30D}
                categories={["WORK"]}
              />
            </div>
            <div className="ml-2 mb-2">
              <TrailingDataCard
                periodTimes={periodTimes30D}
                categories={["LEARN"]}
              />
            </div>
            <div className="ml-2 mb-2">
              <TrailingDataCard
                periodTimes={periodTimes30D}
                categories={["BUILD"]}
              />
            </div>
            <div className="ml-2 mb-2">
              <TrailingDataCard
                periodTimes={periodTimes30D}
                categories={["GENERAL"]}
              />
            </div>
            <div className="ml-2 mb-2">
              <TrailingDataCard
                periodTimes={periodTimes30D}
                categories={["RECOVERY"]}
              />
            </div>
            <div className="ml-2 mb-2">
              <TrailingDataCard
                periodTimes={periodTimes30D}
                categories={["WASTE"]}
              />
            </div>
          </div>
          <div>
            <div className="bg-secondary rounded-lg ml-2 mb-2 text-white font-bold text-center">
              <h2>TRAILING - 7D</h2>
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
                categories={["WASTE"]}
              />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <PeriodTimesTable periodTimes={periodTimes30D} timeframe={"30D"} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

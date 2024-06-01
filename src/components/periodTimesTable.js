import React from "react";
import datetimeFnc from "../functions/datetimeFnc.js";

const PeriodTimesTable = ({ periodTimes, timeframe, title }) => {
  return (
    <div className="rounded-lg w-full h-full bg-white overflow-auto p-2">
      <h1 className="text-center text-2xl pb-2">{title}</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 border border-gray-300 text-sm">Category</th>
            <th className="px-4 border border-gray-300 text-sm">Subcategory</th>
            <th className="px-4 border border-gray-300 text-sm">Total</th>
            <th className="px-4 border border-gray-300 text-sm">Day Avg</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(periodTimes).map((category) =>
            category === "WASTE" ? null : (
              <React.Fragment key={category}>
                <tr className="">
                  <td
                    className="px-2 border border-gray-300"
                    rowSpan={Object.keys(periodTimes[category]).length + 1}
                  >
                    {category}
                  </td>
                </tr>
                {Object.keys(periodTimes[category])
                  .sort((a, b) => (a === "TOTAL" ? 1 : b === "TOTAL" ? -1 : 0))
                  .map((subcategory) => (
                    <tr
                      key={`${category}-${subcategory}`}
                      className={
                        subcategory === "TOTAL" ? "bg-primary text-white" : ""
                      }
                    >
                      <td className="px-2">{subcategory}</td>
                      <td className="px-2 text-center border border-gray-300">
                        {datetimeFnc.convertMinutesToHHMM(
                          periodTimes[category][subcategory]
                        )}
                      </td>
                      <td className="px-2 text-center border border-gray-300">
                        {datetimeFnc.convertMinutesToHHMM(
                          Math.floor(
                            periodTimes[category][subcategory] /
                              (timeframe === "30D" ? 30 : 7)
                          )
                        )}
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PeriodTimesTable;

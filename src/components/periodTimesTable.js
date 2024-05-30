import React from "react";
import datetimeFnc from "../functions/datetimeFnc.js";

const PeriodTimesTable = ({ periodTimes, timeframe }) => {
  return (
    <div className="bg-primary rounded-lg p-1.5">
      <table className="bg-custom-lightblue">
        <thead>
          <tr>
            <th className="px-4">Category</th>
            <th className="px-4">Subcategory</th>
            <th className="px-4">Total Minutes</th>
            <th className="px-4">Day Avg</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(periodTimes).map((category) =>
            category === "WASTE" ? null : (
              <React.Fragment key={category}>
                <tr className="">
                  <td
                    className="px-4"
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
                      className={subcategory === "TOTAL" ? "bg-gray-300" : ""}
                    >
                      <td className="px-4">{subcategory}</td>
                      <td className="px-4 text-right">
                        {datetimeFnc.convertMinutesToHHMM(
                          periodTimes[category][subcategory]
                        )}
                      </td>
                      <td className="px-4 text-right">
                        {datetimeFnc.convertMinutesToHHMM(
                          Math.floor(periodTimes[category][subcategory] / 30)
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

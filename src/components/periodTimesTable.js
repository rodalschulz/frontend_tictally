import React from "react";

const PeriodTimesTable = ({ periodTimes, timeframe }) => {
  return (
    <div className="bg-primary rounded-lg p-4 overflow-x-auto">
      <table className="bg-blue-100">
        <thead>
          <tr>
            <th className="px-4 border-b">Category</th>
            <th className="px-4 border-b">Subcategory</th>
            <th className="px-4 border-b">Total Minutes</th>
            <th className="px-4 border-b">Day Avg</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(periodTimes).map((category) =>
            category === "WASTE" ? null : (
              <React.Fragment key={category}>
                <tr className="border-black border-solid">
                  <td
                    className="px-4 border-b"
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
                      className={subcategory === "TOTAL" ? "bg-blue-200" : ""}
                    >
                      <td className="px-4 border-b">{subcategory}</td>
                      <td className="px-4 border-b text-right">
                        {(periodTimes[category][subcategory] / 60).toFixed(2)}
                      </td>
                      <td className="px-4 border-b text-right">
                        {(
                          periodTimes[category][subcategory] /
                          60 /
                          (timeframe === "30D" ? 30 : 7)
                        ).toFixed(2)}
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

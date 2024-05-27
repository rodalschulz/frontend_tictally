import React, { useEffect, useState } from "react";

const TrailingDataCard = ({
  userActivityData,
  coreLimits,
  categories,
  timeframe,
}) => {
  const [productiveTime, setProductiveTime] = useState(0);

  useEffect(() => {
    const calculateProductiveTime = () => {
      const now = new Date();
      const pastDays = new Date(now.setDate(now.getDate() - timeframe));
      const pastDaysDateString = pastDays.toISOString().split("T")[0];

      const filteredData = userActivityData.filter(
        (item) => item.date.slice(0, 10) > pastDaysDateString
      );

      const aggregatedData = filteredData.reduce((acc, item) => {
        const date = item.date.slice(0, 10);
        if (!acc[date]) {
          acc[date] = { categories: {}, coreSubcategories: {} };
        }
        if (item.category === "CORE") {
          const subcategory = item.subcategory;
          const time = Math.min(
            item.totalTimeMin,
            coreLimits[subcategory] || item.totalTimeMin
          );
          if (!acc[date].coreSubcategories[subcategory]) {
            acc[date].coreSubcategories[subcategory] = 0;
          }
          acc[date].coreSubcategories[subcategory] += time;
        } else {
          if (!acc[date].categories[item.category]) {
            acc[date].categories[item.category] = 0;
          }
          acc[date].categories[item.category] += item.totalTimeMin;
        }
        return acc;
      }, {});

      let totalProductiveTime = 0;
      Object.keys(aggregatedData).forEach((date) => {
        const coreTotal = Object.values(
          aggregatedData[date].coreSubcategories
        ).reduce((a, b) => a + b, 0);
        aggregatedData[date].categories.CORE = coreTotal;

        const dailyProductiveTime = categories.reduce((sum, category) => {
          return sum + (aggregatedData[date].categories[category] || 0);
        }, 0);

        totalProductiveTime += dailyProductiveTime;
      });

      setProductiveTime((totalProductiveTime / 60).toFixed(2)); // Convert minutes to hours
    };

    calculateProductiveTime();
  }, [userActivityData, categories, timeframe]);

  return (
    <div className="p-4 bg-primary rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 text-center w-36 h-8">
        {timeframe} Days
      </h2>
      <p className="text-gray-600 text-center">{categories}:</p>
      <p className="text-2xl font-bold text-gray-800 text-center">
        {productiveTime}H
      </p>
    </div>
  );
};

export default TrailingDataCard;

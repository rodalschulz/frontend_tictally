import React, { useEffect, useState } from "react";

import datetimeFnc from "../utils/datetimeUtl.js";

const TrailingDataCard = ({
  periodTimes,
  categories = [],
  subcategories = [],
}) => {
  const [chosenCatSum, setChosenCatSum] = useState(0);
  const [chosenSubcatSum, setChosenSubcatSum] = useState(0);

  useEffect(() => {
    if (categories.length > 0) {
      let sum = 0;
      categories.forEach((cat) => {
        if (cat === "WASTE") {
          sum += periodTimes.WASTE || 0;
        } else {
          sum += periodTimes[cat]?.TOTAL || 0;
        }
      });
      setChosenCatSum(sum);
    }
  }, [periodTimes, categories]);

  useEffect(() => {
    if (subcategories.length > 0) {
      let sum = 0;
      subcategories.forEach((subcat) => {
        Object.keys(periodTimes).forEach((cat) => {
          if (periodTimes[cat][subcat]) {
            sum += periodTimes[cat][subcat];
          }
        });
      });
      setChosenSubcatSum(sum);
    }
  }, [periodTimes, subcategories]);

  return (
    <div className="bg-primary rounded-lg p-4 w-full">
      <p className="text-center font-bold">
        {subcategories.length > 0
          ? subcategories
          : categories.includes("WORK") &&
            categories.includes("LEARN") &&
            categories.includes("BUILD")
          ? "PRODUCTIVITY"
          : categories}
      </p>
      <p className="text-center">
        {categories.length > 0
          ? datetimeFnc.convertMinutesToHHMM(chosenCatSum)
          : datetimeFnc.convertMinutesToHHMM(chosenSubcatSum)}
      </p>
    </div>
  );
};

export default TrailingDataCard;

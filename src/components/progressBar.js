import React from "react";

const ProgressBar = ({ subcat, minutes }) => {
  const totalMinutes = 600000; // 10,000 hours
  const milestones = [100, 500, 1000, 5000, 10000].map((h) => h * 60);
  const levels = ["Level 0", "Level 1", "Level 2", "Level 3", "Level 4"];
  const currentMilestone = milestones.find((m) => minutes < m) || totalMinutes;
  const milestoneIndex = milestones.indexOf(currentMilestone);
  const progressCurrentMilestone = (minutes / currentMilestone) * 100;
  const progressTotal = (minutes / totalMinutes) * 100;

  return (
    <div className="mb-3 pb-5 pl-4 pr-4 pt-0.5 bg-zinc-900 shadow-lg rounded-lg relative z-0">
      <div className="absolute mt-6 left-1/2 transform -translate-x-1/2 text-center font-bold text-gray-300 text-lg">
        {levels[milestoneIndex]}
      </div>
      <div className="flex justify-between items-center mt-6 mb-4">
        <span className="font-semibold text-white">{subcat}</span>
        <div className="text-right text-gray-300">
          <div className="text-sm">
            {progressCurrentMilestone.toFixed(2)}% of {currentMilestone / 60}{" "}
            hrs
          </div>
          <div className="text-xs">
            {progressTotal.toFixed(2)}% of 10,000 hrs
          </div>
        </div>
      </div>
      <div className="relative mb-2">
        <div className="w-full bg-zinc-950 rounded-full h-6 relative overflow-hidden">
          {milestones.map((m, index) =>
            m <= currentMilestone ? (
              <div
                key={index}
                className="absolute top-0 h-6 w-0.5 bg-gray-400"
                style={{ left: `${(m / currentMilestone) * 100}%` }}
              ></div>
            ) : null
          )}
          <div
            className="bg-custom-shinyBlue h-6 rounded-full"
            style={{ width: `${progressCurrentMilestone}%` }}
          >
            <span className="text-gray-300 pl-2 text-xs">
              {Math.round(minutes / 60)} hrs
            </span>
          </div>
        </div>
      </div>
      <div className="relative mt-2 mr-6">
        {milestones.map((m, index) =>
          m <= currentMilestone ? (
            <div
              key={index}
              className="absolute text-xs text-gray-400"
              style={{
                left: `${(m / currentMilestone) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              {m / 60} hrs
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ProgressBar;

import React from "react";

const ProgressBar = ({ subcat, minutes }) => {
  const totalMinutes = 600000;
  const milestones = [500, 1000, 5000].map((h) => h * 60);
  const progress = (minutes / totalMinutes) * 100;

  return (
    <div className="mb-3 p-4 bg-gray-100 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-gray-700">{subcat}</span>
        <span className="text-gray-600">{progress.toFixed(2)}%</span>
      </div>
      <div className="relative">
        <div className="w-full bg-gray-300 rounded-full h-8 relative overflow-hidden">
          {milestones.map((m, index) => (
            <div
              key={index}
              className="absolute top-0 h-8 w-0.5 bg-secondary"
              style={{ left: `${(m / totalMinutes) * 100}%` }}
            ></div>
          ))}
          <div
            className="bg-primary h-8 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="relative mt-2">
          {milestones.map((m, index) => (
            <div
              key={index}
              className="absolute text-xs text-secondary"
              style={{
                left: `${(m / totalMinutes) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              {m / 60} hrs
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

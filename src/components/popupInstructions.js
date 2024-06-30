import React from "react";

const PopupInstructions = ({ text }) => {
  return text.includes("Start/End:") ||
    text.includes("Adjust:") ||
    text.includes("Time:") ||
    text.includes("Recurring:") ||
    text.includes("Relevance") ? (
    <div className="absolute z-50 bg-primary py-2 pl-3 pr-2 border rounded shadow-lg mt-2 ml-[-16rem] w-80 text-left text-xs">
      <div>{text}</div>
    </div>
  ) : text.includes("description") ? (
    <div className="absolute z-50 bg-primary py-2 pl-3 pr-2 border rounded shadow-lg mt-24 ml-2 w-80 text-left text-xs">
      <div>{text}</div>
    </div>
  ) : (
    <div className="absolute z-50 bg-primary py-2 pl-3 pr-2 border rounded shadow-lg mt-2 ml-2 w-80 text-left text-xs">
      <div>{text}</div>
    </div>
  );
};

export default PopupInstructions;

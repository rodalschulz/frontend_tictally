import React from "react";

const PopupInstructions = ({ text }) => {
  return text.includes("Start/End:") ||
    text.includes("Adjust:") ||
    text.includes("Time:") ||
    text.includes("Recurring:") ? (
    <div className="absolute z-50 bg-primary p-4 border rounded shadow-lg mt-2 ml-[-14rem] w-fit text-left">
      <pre>{text}</pre>
    </div>
  ) : (
    <div className="absolute z-50 bg-primary p-4 border rounded shadow-lg mt-2 ml-2 w-fit text-left text-sm">
      <pre>{text}</pre>
    </div>
  );
};

export default PopupInstructions;

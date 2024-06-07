import React from "react";

const SidebarButton = ({ onClick, icon, bgColor, borderColor }) => {
  return (
    <button
      className={`btn w-full flex items-center justify-center ${
        bgColor ? bgColor : "btn-primary"
      } ${borderColor ? `border-2 ${borderColor}` : null}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default SidebarButton;

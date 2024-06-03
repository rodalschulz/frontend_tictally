import React from "react";

const SidebarButton = ({ onClick, icon, bgColor }) => {
  return (
    <button
      className={`btn w-full flex items-center justify-center ${
        bgColor ? bgColor : "btn-primary"
      }`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default SidebarButton;

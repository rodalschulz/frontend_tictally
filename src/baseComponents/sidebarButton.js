import React from "react";

const SidebarButton = ({ onClick, icon }) => {
  return (
    <button
      className="btn btn-primary w-full flex items-center justify-center"
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default SidebarButton;

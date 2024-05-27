import React from "react";

const SidebarButton = ({ showSidebar, showText, onClick, icon, text }) => {
  return (
    <button
      className="btn btn-primary w-full flex items-center justify-center mb-3"
      onClick={onClick}
    >
      {showSidebar ? showText && text : icon}
    </button>
  );
};

export default SidebarButton;

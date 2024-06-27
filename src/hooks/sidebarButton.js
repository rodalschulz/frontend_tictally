import React, { useState } from "react";

const SidebarButton = ({ onClick, icon, bgColor, label }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      className={`btn w-full flex items-center justify-center  ${
        bgColor ? bgColor : "btn-primary"
      }`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon}
      {isHovered && (
        <div className="absolute bg-custom-lightblue p-2 rounded-lg left-20 text-secondary">
          <div className="flex flex-col items-start">{label}</div>
        </div>
      )}
    </button>
  );
};

export default SidebarButton;

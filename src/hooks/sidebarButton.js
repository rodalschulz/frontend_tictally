import React, { useState } from "react";

const SidebarButton = ({ onClick, icon, bgColor, label, bgHoverColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      className={`flex items-center justify-center rounded-md sm:w-12 sm:h-12 xs:w-9 xs:h-9 ${
        bgColor ? `${bgColor}` : "bg-primary"
      } ${bgHoverColor ? `hover:${bgHoverColor}` : "hover:bg-custom-vitals"}`}
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

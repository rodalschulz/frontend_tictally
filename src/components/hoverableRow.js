import React, { useState } from "react";
import PopupInstructions from "../components/popupInstructions";

const HoverableRowGuide = ({ children, setPopupText, setHoveredHeader }) => {
  const handleMouseEnter = (event) => {
    if (event.target.textContent.trim() === "ENT/SRCH") {
      setPopupText(
        `Entry/Search Toggle: \nUse the Search Mode to search for \nDATE, DESCRIPTION, CATEGORY or \nSUBCATEGORY. Entry mode to make \nnew entries.`
      );
    } else if (event.target.textContent.trim() === "DATE") {
      setPopupText(
        `Date:\nInput a date with your keyboard or by\nselecting it in the drop down calendar. \nIf no date is given, it will automatically \nset today's date.`
      );
    } else if (event.target.textContent.trim() === "DESCRIPTION") {
      setPopupText(
        `Description:\nInput a description of your activity. Later,\nyou can search for keywords using the search\nmode.`
      );
    } else if (event.target.textContent.trim() === "CATEG") {
      setPopupText(
        `Category:\nThis field is always required and fixed!\nNo new categories can be created. Select\nyour category from the drop down menu.`
      );
    } else if (event.target.textContent.trim() === "SUBCAT") {
      setPopupText(
        `Subcategory:\nYou can create your custom subcategories by going\nto your Configuration Page and submitting them.\nCore subcategories are fixed and can't be changed.`
      );
    } else if (event.target.textContent.trim() === "START") {
      setPopupText(
        `Start/End:\nInput the start time of your activity. Use\nmilitary time format, in HH:MM. If no start\ntime is given, it will automatically set to\ncurrent time.`
      );
    } else if (event.target.textContent.trim() === "ADJ") {
      setPopupText(
        `Adjust:\nEnter a positive number of minutes that\nwill be deducted from the total. It's\nused if you got distracted during the\nactivity.`
      );
    } else if (event.target.textContent.trim() === "TIME") {
      setPopupText(
        `Time:\nThis field is automatically calculated\nbased on the start time, end time\nand the adjustment time.`
      );
    }
    const headerText = event.target.textContent.trim();
    setHoveredHeader(headerText);
  };

  const handleMouseLeave = () => {
    setHoveredHeader(null);
  };

  return (
    <tr onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
    </tr>
  );
};

export default HoverableRowGuide;

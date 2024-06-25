import React from "react";

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
    } else if (event.target.textContent.trim() === "CORE LIMITS") {
      setPopupText(
        `Core Limits:\nThese are limits in minutes for each\nCORE subcategory.`
      );
    } else if (event.target.textContent.trim() === "GENERAL") {
      setPopupText(
        `General:\nThe General category is for activities\nthat don't fit into any other category.`
      );
    } else if (event.target.textContent.trim() === "WORK") {
      setPopupText(
        `Work:\nThe Work category is for activities\nrelated to your job or career.`
      );
    } else if (event.target.textContent.trim() === "LEARN") {
      setPopupText(
        `Learn:\nThe Learn category is for activities\nrelated to gaining knowledge.`
      );
    } else if (event.target.textContent.trim() === "BUILD") {
      setPopupText(
        `Build:\nThe Build category is for activities\nrelated to creating or building something.`
      );
    } else if (event.target.textContent.trim() === "RECOVERY") {
      setPopupText(
        `Recovery:\nThe Recovery category is for activities\nrelated to rest and relaxation.`
      );
    } else if (event.target.textContent.trim() === "Date") {
      setPopupText(
        `Date:\nIf no date is given, it will create an\nad-hoc task (task with no specified date).\nInput a date with your keyboard or by\nselecting it in the drop down calendar.`
      );
    } else if (event.target.textContent.trim() === "Time") {
      setPopupText(
        `Time:\nTime must go with a date. Leave it blank\nfor ad-hoc tasks.`
      );
    } else if (event.target.textContent.trim() === "Relevance") {
      setPopupText(
        `Relevance:\nOnly for ad-hoc tasks (dateless tasks).\nIt will just affect the order in which\ntasks are displayed.`
      );
    } else if (event.target.textContent.trim() === "Recurring") {
      setPopupText(
        `Recurring:\nIf a task is recurring, it will be\nautomatically created again after\ncompletion.`
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

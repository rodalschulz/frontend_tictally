import React from "react";

const HoverableRowGuide = ({ children, setPopupText, setHoveredHeader }) => {
  const handleMouseEnter = (event) => {
    if (event.target.textContent.trim() === "ENT/SRCH") {
      setPopupText(
        `Use the entry mode to make new entries or modify existing ones. Use the Search Mode to search by DATE, DESCRIPTION, CATEGORY or SUBCATEGORY.`
      );
    } else if (event.target.textContent.trim() === "DATE") {
      setPopupText(
        `Input a date with your keyboard or by selecting it in the drop down calendar. If no date is given, it will auto-set today's date.`
      );
    } else if (event.target.textContent.trim() === "DESCRIPTION Entry Mode") {
      setPopupText(
        `Input a description for your activity. Later,\nyou can search for keywords using the search\nmode.`
      );
    } else if (event.target.textContent.trim() === "CATEG") {
      setPopupText(
        `This field is always required and fixed: no new categories can be created. Select a category from the drop down menu.`
      );
    } else if (event.target.textContent.trim() === "SUBCAT") {
      setPopupText(
        `You can create your custom subcategories by going to your Configuration Page and submitting them. Core subcategories come by default and can't be modified.`
      );
    } else if (event.target.textContent.trim() === "START") {
      setPopupText(
        `Start/End: Input the start time of your activity. Use military time format, in HH:MM. If no start time is given, it will automatically set to current time.`
      );
    } else if (event.target.textContent.trim() === "ADJ") {
      setPopupText(
        `Adjust: Enter a positive number of minutes that will be deducted from the total. It's used if you got distracted during the activity.`
      );
    } else if (event.target.textContent.trim() === "TIME") {
      setPopupText(
        `Total Time: This field is automatically calculated based on the start time, end time and the adjustment time.`
      );
    } else if (event.target.textContent.trim() === "CORE LIMITS") {
      setPopupText(
        `These are limits (in minutes) for each CORE subcategory. Set SLEEP to 480 for a max of 8 hours of sleep.`
      );
    } else if (event.target.textContent.trim() === "GENERAL") {
      setPopupText(
        `The General category is for activities that don't fit into any other category.`
      );
    } else if (event.target.textContent.trim() === "WORK") {
      setPopupText(
        `The Work category is for activities related to money-making. It's a productive category.`
      );
    } else if (event.target.textContent.trim() === "LEARN") {
      setPopupText(
        `The Learn category is for activities related to gaining knowledge. It's a productive category.`
      );
    } else if (event.target.textContent.trim() === "BUILD") {
      setPopupText(
        `The Build category is for activities related to creating or building something that could potentially have a future value. It's a productive category.`
      );
    } else if (event.target.textContent.trim() === "RECOVERY") {
      setPopupText(
        `The Recovery category is for activities related to rest and relaxation.`
      );
    } else if (event.target.textContent.trim() === "Date") {
      setPopupText(
        `If no date is given, it will create an ad-hoc task (task with no specified date). Input a date with your keyboard or by selecting it in the drop down calendar.`
      );
    } else if (event.target.textContent.trim() === "Time") {
      setPopupText(
        `Time must go with a date. Leave it blank for ad-hoc tasks.`
      );
    } else if (event.target.textContent.trim() === "Category") {
      setPopupText(
        `Select a category from the drop down menu. That way you'll be able to filter your tasks by category.`
      );
    } else if (event.target.textContent.trim() === "Relev | Urgen") {
      setPopupText(
        `Relevance and Urgency are used to prioritize your tasks; it will just affect the sorting order of your ad-hoc tasks.`
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

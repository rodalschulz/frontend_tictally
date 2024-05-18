import { act, useEffect, useState } from "react";
import * as SDK from "../sdk_backend_fetch.js";
import { useParams } from "react-router-dom";
import datetimeFnc from "../functions/datetimeFnc.js";

const useUserActivityData = () => {
  const { userId } = useParams();
  const [userActivityData, setUserActivityData] = useState([]);

  const fetchUserActivityData = async () => {
    try {
      const data = await SDK.getUserActivityData(userId);
      setUserActivityData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserActivityData();
  }, [userId]); // Fetch data only when userId changes

  return userActivityData;
};

const activityEntryValidation = (input) => {
  if (!input.date) {
    input.date = datetimeFnc.currentLocalDate();
  } else {
    input.date = new Date(input.date);
  }
  if (input.adjustment) {
    if (input.adjustment > 59) {
      input.adjustment = 59;
    } else if (input.adjustment < 0) {
      input.adjustment = 0;
    }
  }
  if (input.category) {
    input.category = input.category.toUpperCase();
  }
  if (input.subcategory) {
    input.subcategory = input.subcategory.toUpperCase();
  }
  if (!input.startTime) {
    input.startTime = datetimeFnc.currentLocalTimeHHMM();
  }

  const updatedInput = {
    ...input,
    date: input.date,
    category: input.category,
    subcategory: input.subcategory,
    adjustment: parseInt(input.adjustment),
    timezone: datetimeFnc.getUTCoffset(),
  };
  return updatedInput;
};

const activityPatchValidation = (input) => {
  const updatedInput = { ...input };
  for (const key in updatedInput) {
    if (
      updatedInput[key] === null ||
      updatedInput[key] === undefined ||
      updatedInput[key] === ""
    ) {
      delete updatedInput[key];
    }
  }
  return updatedInput;
};

export default {
  useUserActivityData,
  activityEntryValidation,
  activityPatchValidation,
};

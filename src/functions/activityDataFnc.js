import { useEffect, useState } from "react";
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
    if (+input.adjustment > 59) {
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
    input.startTime = datetimeFnc.currentLocalTime();
  } else {
    input.startTime = datetimeFnc.timeStrToInputDateTime(
      input.startTime,
      input.date
    );
  }
  if (input.endTime) {
    input.endTime = datetimeFnc.timeStrToInputDateTime(
      input.endTime,
      input.date
    );
  }
  if (input.startTime && input.endTime) {
    const totalTime = datetimeFnc.calculateTotalTimeMin(
      input.endTime,
      input.startTime
    );
    input.totalTimeMin = totalTime;
  }

  const updatedInput = {
    ...input,
    date: input.date,
    category: input.category,
    subcategory: input.subcategory,
    adjustment: parseInt(input.adjustment),
    startTime: input.startTime,
    endTime: input.endTime,
    totalTimeMin: input.totalTimeMin,
    timezone: datetimeFnc.getUTCoffset(),
  };
  console.log(updatedInput);
  return updatedInput;
};

const activityPatchValidation = (input, date, startTime, endTime) => {
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
  if (updatedInput.subcategory) {
    updatedInput.subcategory = updatedInput.subcategory.toUpperCase();
  }
  if (updatedInput.category) {
    updatedInput.category = updatedInput.category.toUpperCase();
  }
  if (updatedInput.adjustment) {
    if (+updatedInput.adjustment > 59) {
      updatedInput.adjustment = 59;
    } else if (updatedInput.adjustment < 0) {
      updatedInput.adjustment = 0;
    }
  }

  // If date is updated, update startTime and endTime
  if (updatedInput.date) {
    updatedInput.date = new Date(updatedInput.date);
    if (updatedInput.startTime && updatedInput.endTime) {
      updatedInput.startTime = datetimeFnc.timeStrToInputDateTime(
        updatedInput.startTime,
        updatedInput.date
      );
      updatedInput.endTime = datetimeFnc.timeStrToInputDateTime(
        updatedInput.endTime,
        updatedInput.date
      );
      const totalTime = datetimeFnc.calculateTotalTimeMin(
        updatedInput.endTime,
        updatedInput.startTime
      );
      updatedInput.totalTimeMin = totalTime;
    }

    if (updatedInput.startTime && !updatedInput.endTime) {
      updatedInput.startTime = datetimeFnc.timeStrToInputDateTime(
        updatedInput.startTime,
        updatedInput.date
      );
      updatedInput.endTime = datetimeFnc.timeDateTimeToInputDateTime(
        endTime,
        updatedInput.date
      );
      const totalTime = datetimeFnc.calculateTotalTimeMin(
        updatedInput.endTime,
        updatedInput.startTime
      );
      updatedInput.totalTimeMin = totalTime;
    } else if (startTime && !updatedInput.endTime) {
      updatedInput.startTime = datetimeFnc.timeDateTimeToInputDateTime(
        startTime,
        updatedInput.date
      );
      if (endTime) {
        updatedInput.endTime = datetimeFnc.timeDateTimeToInputDateTime(
          endTime,
          updatedInput.date
        );
      }
    }

    if (updatedInput.endTime && !updatedInput.startTime) {
      updatedInput.endTime = datetimeFnc.timeStrToInputDateTime(
        updatedInput.endTime,
        updatedInput.date
      );
      updatedInput.startTime = datetimeFnc.timeDateTimeToInputDateTime(
        startTime,
        updatedInput.date
      );
      const totalTime = datetimeFnc.calculateTotalTimeMin(
        updatedInput.endTime,
        updatedInput.startTime
      );
      updatedInput.totalTimeMin = totalTime;
    } else if (endTime && !updatedInput.startTime) {
      updatedInput.endTime = datetimeFnc.timeDateTimeToInputDateTime(
        endTime,
        updatedInput.date
      );
      if (startTime) {
        updatedInput.startTime = datetimeFnc.timeDateTimeToInputDateTime(
          startTime,
          updatedInput.date
        );
      }
    }
  }

  // If startTime or endTime is updated and not date, update totalTimeMin
  if (updatedInput.startTime && !updatedInput.date) {
    console.log("startTime");
    updatedInput.startTime = datetimeFnc.timeStrToInputDateTime(
      updatedInput.startTime,
      date
    );
    if (updatedInput.endTime) {
      const totalTime = datetimeFnc.calculateTotalTimeMin(
        updatedInput.endTime,
        updatedInput.startTime
      );
      updatedInput.totalTimeMin = totalTime;
    } else if (endTime) {
      const totalTime = datetimeFnc.calculateTotalTimeMin(
        endTime,
        updatedInput.startTime
      );
      updatedInput.totalTimeMin = totalTime;
    } else {
      updatedInput.totalTimeMin = 0;
    }
  }

  if (updatedInput.endTime && !updatedInput.date) {
    console.log("endTime");
    updatedInput.endTime = datetimeFnc.timeStrToInputDateTime(
      updatedInput.endTime,
      date
    );
    if (updatedInput.startTime) {
      const totalTime = datetimeFnc.calculateTotalTimeMin(
        updatedInput.endTime,
        updatedInput.startTime
      );
      updatedInput.totalTimeMin = totalTime;
    } else if (startTime) {
      const totalTime = datetimeFnc.calculateTotalTimeMin(
        updatedInput.endTime,
        startTime
      );
      updatedInput.totalTimeMin = totalTime;
    } else {
      updatedInput.totalTimeMin = 0;
    }
  }

  return updatedInput;
};

export default {
  useUserActivityData,
  activityEntryValidation,
  activityPatchValidation,
};

import datetimeFnc from "./datetimeFnc.js";

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
  }
  if (input.startTime && input.endTime) {
    const totalTime = datetimeFnc.calculateTotalTimeMin(
      input.endTime,
      input.startTime
    );
    input.totalTimeMin = totalTime;
    if (input.adjustment && input.adjustment < totalTime) {
      input.totalTimeMin -= input.adjustment;
    } else if (input.adjustment && input.adjustment >= totalTime) {
      input.totalTimeMin = 0;
      alert("Adjustment can't be equal or greater than total time.");
      throw new Error("Adjustment can't be equal or greater than total time.");
    }
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
  return updatedInput;
};

const activityPatchValidation = (input, startTime, endTime, adjustment) => {
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
  if (updatedInput.category) {
    updatedInput.category = updatedInput.category.toUpperCase();
  }
  if (updatedInput.subcategory) {
    updatedInput.subcategory = updatedInput.subcategory.toUpperCase();
  }
  if (updatedInput.adjustment) {
    if (+updatedInput.adjustment > 59) {
      updatedInput.adjustment = 59;
    } else if (+updatedInput.adjustment < 0) {
      updatedInput.adjustment = 0;
    }
  }
  if (updatedInput.date) {
    updatedInput.date = new Date(updatedInput.date);
  }

  if (
    updatedInput.startTime ||
    updatedInput.endTime ||
    updatedInput.adjustment
  ) {
    const relevantStartTime = updatedInput.startTime || startTime;
    const relevantEndTime = updatedInput.endTime || endTime;
    const relevantAdjustment = updatedInput.adjustment || adjustment;
    const totalTime = datetimeFnc.calculateTotalTimeMin(
      relevantEndTime,
      relevantStartTime
    );
    updatedInput.totalTimeMin = totalTime;
    if (relevantAdjustment && relevantAdjustment < totalTime) {
      updatedInput.totalTimeMin -= relevantAdjustment;
    } else if (relevantAdjustment && relevantAdjustment >= totalTime) {
      updatedInput.totalTimeMin = 0;
      alert("Adjustment can't be equal or greater than total time.");
      throw new Error("Adjustment can't be equal or greater than total time.");
    }
  }

  return updatedInput;
};

export default {
  activityEntryValidation,
  activityPatchValidation,
};

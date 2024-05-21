const calculateTotalTimeMin = (endTimeStr, startTimeStr) => {
  console.log(`calculateTotalTimeMin: ${endTimeStr} ${startTimeStr}`);
  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);
  const diffMs = endTime - startTime;
  const diffMinutes = diffMs / (1000 * 60);
  if (diffMinutes < 0) {
    alert("Error: Negative time difference");
    return "Error: Negative time difference";
  }
  return diffMinutes;
};

const getUTCoffset = () => {
  const date = new Date();
  const timezoneOffsetMinutes = date.getTimezoneOffset();
  const timezoneOffsetHours = timezoneOffsetMinutes / 60;
  const sign = timezoneOffsetHours > 0 ? "-" : "+";
  const absOffsetHours = Math.abs(timezoneOffsetHours);
  return `${sign}${absOffsetHours}`;
};

const currentLocalDate = () => {
  const utcDate = new Date();
  const timezoneOffsetMinutes = utcDate.getTimezoneOffset();
  const localDate = new Date(
    utcDate.getTime() - timezoneOffsetMinutes * 60000
  ).toISOString();
  const localDateZero = localDate.slice(0, 11) + "00:00:00.000Z";
  return localDateZero;
};

const currentLocalTime = () => {
  const utcDate = new Date();
  const timezoneOffsetMinutes = utcDate.getTimezoneOffset();
  const localDateTime = new Date(
    utcDate.getTime() - timezoneOffsetMinutes * 60000
  ).toISOString();
  return localDateTime;
};

const getTimeHHMM = (date) => {
  if (!date) {
    return "";
  }
  const dateTime = new Date(date);
  const hours = dateTime.getUTCHours();
  const minutes = dateTime.getUTCMinutes();
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const timeDateTimeToInputDateTime = (dateTime, inputDate) => {
  const dateTimeStr = new Date(dateTime).toISOString();
  const timeString = dateTimeStr.slice(11, 16);
  const date = new Date(inputDate).toISOString();
  const timeStrToInputDateTime = date.slice(0, 11) + timeString + ":00.000Z";
  return timeStrToInputDateTime;
};

const timeStrToInputDateTime = (timeString, inputDate) => {
  if (!timeString) {
    return null;
  }
  const date = new Date(inputDate).toISOString();
  const timeStrToInputDateTime = date.slice(0, 11) + timeString + ":00.000Z";
  return timeStrToInputDateTime;
};

const timeStrToLocalDateTime = (timeString) => {
  if (!timeString) {
    return null;
  }
  const utcDate = new Date();
  const timezoneOffsetMinutes = utcDate.getTimezoneOffset();
  const localDateTime = new Date(
    utcDate.getTime() - timezoneOffsetMinutes * 60000
  ).toISOString();
  const timeToLocalDateTime =
    localDateTime.slice(0, 11) + timeString + ":00.000Z";
  return timeToLocalDateTime;
};

const convertMinutesToHHMM = (totalMinutes) => {
  if (
    typeof totalMinutes !== "number" ||
    isNaN(totalMinutes) ||
    !Number.isInteger(totalMinutes) ||
    totalMinutes < 0
  ) {
    return null;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const pad = (num) => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}`;
};

const getDDMMYYYY = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

const getDDMMYY = (date) => {
  const [year, month, day] = date.split("-");
  const yearShort = year.slice(2);
  return `${day}-${month}-${yearShort}`;
};

const getWeekDay = (date) => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const day = new Date(date).getDay();
  return days[day];
};

export default {
  getUTCoffset,
  getDDMMYYYY,
  getDDMMYY,
  getWeekDay,
  currentLocalDate,
  getTimeHHMM,
  timeStrToInputDateTime,
  timeStrToLocalDateTime,
  currentLocalTime,
  convertMinutesToHHMM,
  calculateTotalTimeMin,
  timeDateTimeToInputDateTime,
};

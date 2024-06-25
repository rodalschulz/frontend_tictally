const calculateTotalTimeMin = (endTimeStr, startTimeStr) => {
  if (!endTimeStr || !startTimeStr) {
    return null;
  }
  const startHours = parseInt(startTimeStr.slice(0, 2));
  const startMinutes = parseInt(startTimeStr.slice(3, 5));
  const endHours = parseInt(endTimeStr.slice(0, 2));
  const endMinutes = parseInt(endTimeStr.slice(3, 5));
  if (startHours * 60 + startMinutes > endHours * 60 + endMinutes) {
    alert("End time can't be lower than start time.");
    throw new Error("End time can't be lower than start time.");
  }
  const totalTimeMin =
    (endHours - startHours) * 60 + (endMinutes - startMinutes);
  return totalTimeMin;
};

const currentLocalTime = () => {
  const utcDate = new Date();
  const timezoneOffsetMinutes = utcDate.getTimezoneOffset();
  const localDate = new Date(utcDate.getTime() - timezoneOffsetMinutes * 60000);
  localDate.setSeconds(0, 0);
  const localTimeStr = localDate.toISOString().slice(11, 16);
  return localTimeStr;
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

const getLocalDateObject = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // offset in milliseconds
  const localDate = new Date(now.getTime() - offset);
  return localDate;
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
  const day = new Date(date).getUTCDay();
  return days[day];
};

export default {
  getUTCoffset,
  getDDMMYYYY,
  getDDMMYY,
  getWeekDay,
  currentLocalDate,
  timeStrToInputDateTime,
  timeStrToLocalDateTime,
  currentLocalTime,
  convertMinutesToHHMM,
  calculateTotalTimeMin,
  timeDateTimeToInputDateTime,
  getLocalDateObject,
};

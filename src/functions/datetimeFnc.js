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
  const localDate = new Date(utcDate.getTime() - timezoneOffsetMinutes * 60000);
  return localDate;
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
};

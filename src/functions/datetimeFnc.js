const getUTCoffset = () => {
  const date = new Date();
  const timezoneOffsetMinutes = date.getTimezoneOffset();
  const timezoneOffsetHours = timezoneOffsetMinutes / 60;
  const sign = timezoneOffsetHours > 0 ? "-" : "+";
  const absOffsetHours = Math.abs(timezoneOffsetHours);
  return `${sign}${absOffsetHours}`;
};

const getDDMMYYYY = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

const getWeekDay = (date) => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const day = new Date(date).getDay();
  return days[day];
};

export default { getUTCoffset, getDDMMYYYY, getWeekDay };

import datetimeUtl from "../utils/datetimeUtl";

const useCurrTimeData = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const daysForward = 14;
  const nowStart = datetimeUtl.getLocalDateObject();
  nowStart.setDate(nowStart.getDate() - 1);
  const now = datetimeUtl.getLocalDateObject();
  now.setHours(23, 59, 59, 999);
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + daysForward);

  return { currentYear, currentMonth, nowStart, now, futureDate };
};

export default useCurrTimeData;

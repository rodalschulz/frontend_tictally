import { useEffect, useState } from "react";
import datetimeFnc from "../functions/datetimeFnc";

const useCalculatePeriodTimes = (timeframe, coreLimits, userActivityData) => {
  const [periodTimes, setPeriodTimes] = useState({});

  useEffect(() => {
    if (userActivityData.length > 0) {
      const totalDailyTimes = () => {
        const now = datetimeFnc.getLocalDateObject();
        const pastDays = new Date(now);
        pastDays.setDate(now.getDate() - timeframe - 1);

        const pastDaysDateString = pastDays.toISOString().slice(0, 10);
        const todayDateString = now.toISOString().slice(0, 10);

        const filteredData = userActivityData.filter(
          (item) =>
            item.date.slice(0, 10) > pastDaysDateString &&
            item.date.slice(0, 10) < todayDateString
        );

        const totalDailyTimesObj = filteredData.reduce((acc, item) => {
          const date = item.date.slice(0, 10);
          if (!acc[date]) {
            acc[date] = {
              CORE: {
                TOTAL: 0,
                SLEEP: 0,
                EAT: 0,
                GROOM: 0,
                RELIEF: 0,
                FITNESS: 0,
                INFORM: 0,
              },
              WORK: { TOTAL: 0 },
              LEARN: { TOTAL: 0 },
              BUILD: { TOTAL: 0 },
              GENERAL: { TOTAL: 0 },
              RECOVERY: { TOTAL: 0 },
              WASTE: 0,
            };
          }

          if (item.category === "CORE") {
            const subcategory = item.subcategory;
            const validTime = Math.min(
              item.totalTimeMin,
              coreLimits[subcategory] || item.totalTimeMin
            );
            acc[date].CORE.TOTAL += validTime;
            acc[date].CORE[subcategory] += item.totalTimeMin;
          } else {
            const subcategory = item.subcategory;
            const category = item.category;
            acc[date][category].TOTAL += item.totalTimeMin;
            if (!acc[date][category][subcategory]) {
              acc[date][category][subcategory] = 0;
            }
            acc[date][category][subcategory] += item.totalTimeMin;
          }
          return acc;
        }, {});

        // Calculate WASTE time for each day
        Object.keys(totalDailyTimesObj).forEach((date) => {
          const totalUsedTime =
            totalDailyTimesObj[date].CORE.TOTAL +
            totalDailyTimesObj[date].WORK.TOTAL +
            totalDailyTimesObj[date].LEARN.TOTAL +
            totalDailyTimesObj[date].BUILD.TOTAL +
            totalDailyTimesObj[date].GENERAL.TOTAL +
            totalDailyTimesObj[date].RECOVERY.TOTAL;

          const wasteTime = 1440 - totalUsedTime;
          totalDailyTimesObj[date].WASTE = wasteTime < 0 ? 0 : wasteTime;
        });
        return totalDailyTimesObj;
      };

      const calculateTotalPeriodTimes = (totalDailyTimesObj) => {
        const totalPeriodTimesObj = {
          CORE: {
            TOTAL: 0,
            SLEEP: 0,
            EAT: 0,
            GROOM: 0,
            RELIEF: 0,
            FITNESS: 0,
            INFORM: 0,
          },
          WORK: { TOTAL: 0 },
          LEARN: { TOTAL: 0 },
          BUILD: { TOTAL: 0 },
          GENERAL: { TOTAL: 0 },
          RECOVERY: { TOTAL: 0 },
          WASTE: 0,
        };

        Object.keys(totalDailyTimesObj).forEach((date) => {
          Object.keys(totalDailyTimesObj[date]).forEach((category) => {
            if (category === "WASTE") {
              totalPeriodTimesObj.WASTE += totalDailyTimesObj[date].WASTE;
            } else {
              totalPeriodTimesObj[category].TOTAL +=
                totalDailyTimesObj[date][category].TOTAL;
              Object.keys(totalDailyTimesObj[date][category]).forEach(
                (subcategory) => {
                  if (subcategory !== "TOTAL") {
                    if (!totalPeriodTimesObj[category][subcategory]) {
                      totalPeriodTimesObj[category][subcategory] = 0;
                    }
                    totalPeriodTimesObj[category][subcategory] +=
                      totalDailyTimesObj[date][category][subcategory];
                  }
                }
              );
            }
          });
        });
        return totalPeriodTimesObj;
      };

      const dailyTimes = totalDailyTimes();
      const periodTimes = calculateTotalPeriodTimes(dailyTimes);
      setPeriodTimes(periodTimes);
    }
  }, [userActivityData, coreLimits, timeframe]);

  return periodTimes;
};

export default useCalculatePeriodTimes;

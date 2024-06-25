import { useState, useEffect, useRef } from "react";

import { getUserPendingTasks } from "../sdk_backend_fetch";
import useCurrTimeData from "./useCurrTimeData";

const useFetchPendingTasks = (userId, daysTotal, setIsLoading) => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const { currentYear, currentMonth } = useCurrTimeData();
  const hasFetched = useRef(false);

  const fetchPendingTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getUserPendingTasks(userId, daysTotal);
      const tasksMod = data.map((task) => {
        if (task.periodRecurrence === "YEARLY") {
          let date = new Date(task.date);
          date.setFullYear(currentYear);
          task.date = date.toISOString();
        }
        if (task.periodRecurrence === "MONTHLY") {
          let date = new Date(task.date);
          date.setFullYear(currentYear);
          date.setMonth(currentMonth);
          task.date = date.toISOString();
        }
        return task;
      });
      tasksMod.sort((a, b) => {
        if (a.date && b.date) {
          return new Date(a.date) - new Date(b.date);
        } else if (a.date && !b.date) {
          return -1;
        } else if (!a.date && b.date) {
          return 1;
        } else {
          return 0;
        }
      });
      setPendingTasks(tasksMod);
      setDataFetched(true);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchPendingTasks();
  }, [fetchPendingTasks]);

  return { pendingTasks, setPendingTasks, fetchPendingTasks, dataFetched };
};

export default useFetchPendingTasks;

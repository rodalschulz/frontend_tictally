import { useState, useEffect, useCallback } from "react";

import * as SDK from "../sdk_backend_fetch.js";

const useFetchPendingTasks = (userId, daysTotal, setIsLoading) => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  const fetchPendingTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await SDK.getUserPendingTasks(userId, daysTotal);
      setPendingTasks(data);
      setDataFetched(true);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [userId, daysTotal]);

  useEffect(() => {
    fetchPendingTasks();
  }, []);

  return { pendingTasks, setPendingTasks, fetchPendingTasks, dataFetched };
};

export default useFetchPendingTasks;

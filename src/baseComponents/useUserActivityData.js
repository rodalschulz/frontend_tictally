import { useState, useEffect, useCallback } from "react";
import * as SDK from "../sdk_backend_fetch.js";

const useUserActivityData = (userId, daysTotal, setIsLoading) => {
  const [userActivityData, setUserActivityData] = useState([]);
  const [activityDataFetched, setActivityDataFetched] = useState(false);

  const fetchUserActivityData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await SDK.getUserActivityData(userId, daysTotal);
      setUserActivityData(data);
      setActivityDataFetched(true);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [userId, daysTotal]);

  useEffect(() => {
    fetchUserActivityData();
  }, [fetchUserActivityData]);

  return {
    userActivityData,
    setUserActivityData,
    fetchUserActivityData,
    activityDataFetched,
  };
};

export default useUserActivityData;

import { useState, useEffect, useCallback } from "react";
import * as SDK from "../sdk_backend_fetch.js";

const useUserActivityData = (userId, daysTotal, setIsLoading) => {
  const [userActivityData, setUserActivityData] = useState([]);

  const fetchUserActivityData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await SDK.getUserActivityData(userId, daysTotal);
      setUserActivityData(data);
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
  };
};

export default useUserActivityData;

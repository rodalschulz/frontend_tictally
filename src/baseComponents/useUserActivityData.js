import { useState, useEffect, useCallback } from "react";
import * as SDK from "../sdk_backend_fetch.js";

const useUserActivityData = (userId, entries, setIsLoading) => {
  const [userActivityData, setUserActivityData] = useState([]);

  const fetchUserActivityData = useCallback(async () => {
    const totalEntries = entries;
    setIsLoading(true);
    try {
      const data = await SDK.getUserActivityData(userId, totalEntries);
      setUserActivityData(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [userId, entries]);

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

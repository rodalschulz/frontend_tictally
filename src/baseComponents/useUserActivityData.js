import { useState, useEffect, useCallback } from "react";
import * as SDK from "../sdk_backend_fetch.js";

const useUserActivityData = (userId, entries) => {
  const [userActivityData, setUserActivityData] = useState([]);

  const fetchUserActivityData = useCallback(async () => {
    const totalEntries = entries;
    try {
      const data = await SDK.getUserActivityData(userId, totalEntries);
      setUserActivityData(data);
    } catch (error) {
      console.error(error);
    }
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

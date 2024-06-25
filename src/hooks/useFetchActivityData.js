import { useState, useEffect, useRef, useCallback } from "react";

import { getUserActivityData } from "../sdk_backend_fetch.js";

const useUserActivityData = (userId, daysTotal, setIsLoading) => {
  const [userActivityData, setUserActivityData] = useState([]);
  const [activityDataFetched, setActivityDataFetched] = useState(false);
  const hasFetched = useRef(false);

  const fetchUserActivityData = async () => {
    setIsLoading(true);
    try {
      const data = await getUserActivityData(userId, daysTotal);
      setUserActivityData(data);
      setActivityDataFetched(true);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchUserActivityData();
  }, [userId]);

  return {
    userActivityData,
    setUserActivityData,
    fetchUserActivityData,
    activityDataFetched,
  };
};

export default useUserActivityData;

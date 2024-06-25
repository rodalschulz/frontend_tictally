import { useState, useEffect, useRef } from "react";

import { getUserCategoryConfig } from "../sdk_backend_fetch";

const useFetchCategoryConfig = (userId) => {
  const [subcategories, setSubcategories] = useState({});
  const [coreLimits, setCoreLimits] = useState({});
  const [subcatsToTrack, setSubcatsToTrack] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const hasFetched = useRef(false);

  const fetchCategoryConfig = async () => {
    try {
      const response = await getUserCategoryConfig(userId);
      setCoreLimits(response.user.categConfig.coreLimits);
      setSubcategories(response.user.categConfig.subcategories);
      setSubcatsToTrack(response.user.categConfig.subcatsToTrack);
    } catch (error) {
      console.error("Error fetching user category config:", error);
      setDataFetched(true);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchCategoryConfig();
  }, [fetchCategoryConfig]);

  return {
    coreLimits,
    setCoreLimits,
    subcategories,
    setSubcategories,
    subcatsToTrack,
    setSubcatsToTrack,
    dataFetched,
  };
};

export default useFetchCategoryConfig;

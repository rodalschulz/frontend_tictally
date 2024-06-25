import { useState, useEffect } from "react";

import * as SDK from "../sdk_backend_fetch.js";

const useFetchCategoryConfig = (userId) => {
  const [subcategories, setSubcategories] = useState({});
  const [coreLimits, setCoreLimits] = useState({});
  const [subcatsToTrack, setSubcatsToTrack] = useState({});
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchCategoryConfig = async () => {
      try {
        const response = await SDK.getUserCategoryConfig(userId);
        setCoreLimits(response.user.categConfig.coreLimits);
        setSubcategories(response.user.categConfig.subcategories);
        setSubcatsToTrack(response.user.categConfig.subcatsToTrack);
      } catch (error) {
        console.error("Error fetching user category config:", error);
        setDataFetched(true);
      }
    };

    fetchCategoryConfig();
  }, [userId]);

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

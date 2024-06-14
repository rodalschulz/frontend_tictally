import { useState, useEffect } from "react";
import * as SDK from "../sdk_backend_fetch.js";

const useFetchCategoryConfig = (userId) => {
  const [subcategories, setSubcategories] = useState({});
  const [coreLimits, setCoreLimits] = useState({});
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchCategoryConfig = async () => {
      try {
        const response = await SDK.getUserCategoryConfig(userId);
        setCoreLimits(response.user.categConfig.coreLimits);
        setSubcategories(response.user.categConfig.subcategories);
      } catch (error) {
        console.error("Error fetching user category config:", error);
        setDataFetched(true);
      }
    };

    fetchCategoryConfig();
  }, [userId]);

  return {
    coreLimits,
    subcategories,
    setSubcategories,
    setCoreLimits,
    dataFetched,
  };
};

export default useFetchCategoryConfig;

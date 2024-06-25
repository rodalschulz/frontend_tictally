import { useState, useEffect } from "react";

import * as SDK from "../sdk_backend_fetch.js";

const useFetchSubcatResults = (userId) => {
  const [subcatResults, setSubcatResults] = useState({});
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchSubcatResults = async () => {
      try {
        const response = await SDK.querySubcatsToTrack(userId);
        setSubcatResults(response.subcatResults);
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching subcategory results:", error);
        setDataFetched(true);
      }
    };

    fetchSubcatResults();
  }, [userId]);

  return {
    subcatResults,
    dataFetched,
  };
};

export default useFetchSubcatResults;

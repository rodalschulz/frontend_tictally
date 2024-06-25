import { useState, useEffect, useRef } from "react";

import { querySubcatsToTrack } from "../sdk_backend_fetch";

const useFetchSubcatResults = (userId) => {
  const [subcatResults, setSubcatResults] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const hasFetched = useRef(false);

  const fetchSubcatResults = async () => {
    try {
      const response = await querySubcatsToTrack(userId);
      setSubcatResults(response.subcatResults);
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching subcategory results:", error);
      setDataFetched(true);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchSubcatResults();
  }, [fetchSubcatResults]);

  return {
    subcatResults,
    dataFetched,
  };
};

export default useFetchSubcatResults;

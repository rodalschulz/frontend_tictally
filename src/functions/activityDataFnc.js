import { useEffect, useState } from "react";
import * as SDK from "../sdk_backend_fetch.js";
import { useParams } from "react-router-dom";

const fetchUserActivityData = async (userId, setUserActivityData) => {
  try {
    const data = await SDK.getUserActivityData(userId);
    setUserActivityData(data);
  } catch (error) {
    console.error(error);
  }
};

const useUserActivityData = () => {
  const { userId } = useParams();
  const [userActivityData, setUserActivityData] = useState([]);

  useEffect(() => {
    fetchUserActivityData(userId, setUserActivityData);
  }, [userId]); // Fetch data only when userId changes

  return userActivityData;
};

export default { useUserActivityData, fetchUserActivityData };

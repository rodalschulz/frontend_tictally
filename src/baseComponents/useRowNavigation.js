import { useState, useEffect, useCallback } from "react";
import * as SDK from "../sdk_backend_fetch.js";

const useRowNavigation = (
  userId,
  userActivityData,
  fetchUserActivityData,
  submit
) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowTimeValues, setSelectedRowTimeValues] = useState({
    startTime: "",
    endTime: "",
    adjustment: 0,
  });

  const handleRowClick = (id, startTime, endTime, adjustment) => {
    if (selectedRow === id) {
      setSelectedRow(null);
      setSelectedRowTimeValues({
        startTime: "",
        endTime: "",
        adjustment: 0,
      });
    } else {
      setSelectedRow(id);
      setSelectedRowTimeValues({
        startTime,
        endTime,
        adjustment,
      });
    }
  };

  const deleteSelected = useCallback(async () => {
    try {
      if (selectedRow) {
        await SDK.deleteUserActivityData(userId, selectedRow);
        fetchUserActivityData();
        setSelectedRow(null);
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedRow, fetchUserActivityData, userId]);

  useEffect(() => {
    const handleArrowKeyPress = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = userActivityData.findIndex(
          (item) => item.id === selectedRow
        );
        if (currentIndex !== -1) {
          const nextIndex =
            e.key === "ArrowUp" ? currentIndex - 1 : currentIndex + 1;
          if (nextIndex >= 0 && nextIndex < userActivityData.length) {
            setSelectedRow(userActivityData[nextIndex].id);
            setSelectedRowTimeValues({
              startTime: userActivityData[nextIndex].startTime,
              endTime: userActivityData[nextIndex].endTime,
              adjustment: userActivityData[nextIndex].adjustment,
            });
          }
        } else if (userActivityData.length > 0) {
          setSelectedRow(userActivityData[0].id);
          setSelectedRowTimeValues({
            date: userActivityData[0].date,
            startTime: userActivityData[0].startTime,
            endTime: userActivityData[0].endTime,
          });
        }
      }
    };

    window.addEventListener("keydown", handleArrowKeyPress);
    return () => {
      window.removeEventListener("keydown", handleArrowKeyPress);
    };
  }, [selectedRow, userActivityData]);

  useEffect(() => {
    const handleDelPress = (e) => {
      if (e.key === "Delete") {
        const activeElement = document.activeElement;
        if (
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA")
        ) {
          return; // Do not delete if an input field or textarea is focused
        }
        deleteSelected();
      }
    };

    window.addEventListener("keydown", handleDelPress);
    return () => window.removeEventListener("keydown", handleDelPress);
  });

  useEffect(() => {
    const handleEscapePress = (e) => {
      if (e.key === "Escape") {
        setSelectedRow(null);
        setSelectedRowTimeValues({
          date: null,
          startTime: null,
          endTime: null,
        });
      }
    };

    window.addEventListener("keydown", handleEscapePress);
    return () => {
      window.removeEventListener("keydown", handleEscapePress);
    };
  }, []);

  useEffect(() => {
    const handleEnterPress = async (e) => {
      if (e.key === "Enter") {
        submit(e);
      }
    };
    window.addEventListener("keydown", handleEnterPress);
    return () => window.removeEventListener("keydown", handleEnterPress);
  }, [submit]);

  return {
    selectedRow,
    selectedRowTimeValues,
    handleRowClick,
    deleteSelected,
    setSelectedRow,
    setSelectedRowTimeValues,
  };
};

export default useRowNavigation;

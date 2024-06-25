import { useState, useEffect, useCallback } from "react";

import * as SDK from "../sdk_backend_fetch.js";

const useRowNavigation = (
  userId,
  userData,
  fetchUserData,
  submit,
  setIsLoading
) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowTimeValues, setSelectedRowTimeValues] = useState({
    startTime: "",
    endTime: "",
    adjustment: 0,
  });
  const [firstSelectedRow, setFirstSelectedRow] = useState(null);

  const handleRowClick = (id, startTime, endTime, adjustment, event) => {
    if (event.shiftKey && firstSelectedRow !== null) {
      // Find the indexes of the first selected row and the current row
      const firstIndex = userData.findIndex(
        (item) => item.id === firstSelectedRow
      );
      const currentIndex = userData.findIndex((item) => item.id === id);

      // Determine the range to select
      const [start, end] =
        firstIndex < currentIndex
          ? [firstIndex, currentIndex]
          : [currentIndex, firstIndex];

      // Get the IDs of all rows in the range
      const newSelectedRows = userData
        .slice(start, end + 1)
        .map((item) => item.id);

      setSelectedRows((prevSelectedRows) => [
        ...new Set([...prevSelectedRows, ...newSelectedRows]),
      ]);
      setSelectedRowTimeValues({
        startTime,
        endTime,
        adjustment,
      });
    } else {
      if (selectedRows.length === 1 && selectedRows.includes(id)) {
        setSelectedRows([]);
        setSelectedRowTimeValues({
          startTime: "",
          endTime: "",
          adjustment: 0,
        });
      } else if (event.ctrlKey) {
        setSelectedRows((prevSelectedRows) => {
          if (prevSelectedRows.includes(id)) {
            return prevSelectedRows.filter((rowId) => rowId !== id);
          } else {
            return [...prevSelectedRows, id];
          }
        });
        setSelectedRowTimeValues({
          startTime,
          endTime,
          adjustment,
        });
      } else {
        setSelectedRows([id]);
        setSelectedRowTimeValues({
          startTime,
          endTime,
          adjustment,
        });
      }
      setFirstSelectedRow(id);
    }
  };

  const deleteSelected = useCallback(async () => {
    try {
      setIsLoading(true);
      if (selectedRows.length > 0) {
        // check for adjustment property to determine if we are deleting activities or pending tasks
        if (userData[0].hasOwnProperty("adjustment")) {
          await SDK.deleteUserActivityData(userId, selectedRows);
        } else {
          await SDK.deleteUserPendingTasks(userId, selectedRows);
        }
        fetchUserData();
        setSelectedRows([]);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [selectedRows, fetchUserData, userId]);

  useEffect(() => {
    const handleArrowKeyPress = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = userData.findIndex(
          (item) => item.id === selectedRows[selectedRows.length - 1]
        );
        if (currentIndex !== -1) {
          const nextIndex =
            e.key === "ArrowUp" ? currentIndex - 1 : currentIndex + 1;
          if (nextIndex >= 0 && nextIndex < userData.length) {
            setSelectedRows([userData[nextIndex].id]);
            setSelectedRowTimeValues({
              startTime: userData[nextIndex].startTime,
              endTime: userData[nextIndex].endTime,
              adjustment: userData[nextIndex].adjustment,
            });
          }
        } else if (userData.length > 0) {
          setSelectedRows([userData[0].id]);
          setSelectedRowTimeValues({
            date: userData[0].date,
            startTime: userData[0].startTime,
            endTime: userData[0].endTime,
          });
        }
      }
    };

    window.addEventListener("keydown", handleArrowKeyPress);
    return () => {
      window.removeEventListener("keydown", handleArrowKeyPress);
    };
  }, [selectedRows, userData]);

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
        setSelectedRows([]);
        setSelectedRowTimeValues({
          startTime: "",
          endTime: "",
          adjustment: 0,
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
    selectedRows,
    selectedRowTimeValues,
    handleRowClick,
    deleteSelected,
    setSelectedRows,
    setSelectedRowTimeValues,
  };
};

export default useRowNavigation;

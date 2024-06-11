import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

import "../styles/v1members.css";
import * as SDK from "../sdk_backend_fetch.js";
import activityData from "../functions/activityDataFnc.js";
import datetimeFnc from "../functions/datetimeFnc.js";

import DownloadCSV from "../components/downloadCSVbtn.js";
import UploadCSVbtn from "../components/uploadCSVbtn.js";
import EntrySearchToggleButton from "../components/entrySearchModebtn.js";
import Sidebar from "../components/sidebar.js";
import useFetchCategoryConfig from "../baseComponents/useFetchCategoryConfig.js";
import useWindowSize from "../baseComponents/useWindowSize.js";
import useUserActivityData from "../baseComponents/useUserActivityData.js";
import useRowNavigation from "../baseComponents/useRowNavigation.js";
import Instructions from "../components/instructions.js";

import { MdAccessTimeFilled, MdMenuOpen } from "react-icons/md";

const Members = () => {
  const { userId } = useParams();

  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showUTC, setShowUTC] = useState(false);
  const [queryTimeSum, setQueryTimeSum] = useState(0);
  const [displayInstructions, setDisplayInstructions] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const { subcategories } = useFetchCategoryConfig(userId);
  const { userActivityData, setUserActivityData, fetchUserActivityData } =
    useUserActivityData(userId, 32, setIsLoading);
  const isMobile = useWindowSize();

  // SEARCH MODE
  const handleToggleClick = () => {
    setIsSearchMode((prevMode) => !prevMode);
  };

  const [input, setInput] = useState({
    date: null,
    date2: null,
    description: null,
    category: null,
    subcategory: null,
    startTime: null,
    endTime: null,
    adjustment: null,
  });
  const formRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });

    // Clear subcategory when category changes
    if (name === "category") {
      setInput((prevInput) => ({
        ...prevInput,
        subcategory: "",
      }));
    }
  };

  const resetForm = () => {
    setInput({
      date: null,
      date2: null,
      description: null,
      category: null,
      subcategory: null,
      startTime: null,
      endTime: null,
      adjustment: null,
    });
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const submitSearch = async (event) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams();
    if (input.description) queryParams.append("description", input.description);
    if (input.category) queryParams.append("category", input.category);
    if (input.subcategory) queryParams.append("subcategory", input.subcategory);
    if (input.date) queryParams.append("date", input.date);
    if (input.date2) queryParams.append("date2", input.date2);

    resetForm();
    try {
      const data = await SDK.queryUserActivityData(userId, queryParams);
      setUserActivityData(data.userActivityData);
      setQueryTimeSum(data.totalSum);
      console.log("Query finished");
    } catch (error) {
      console.error("Error fetching activity data:", error);
    }
    setIsLoading(false);
  };

  const submitPatch = async (event) => {
    setIsLoading(true);
    try {
      const idsToPatch = selectedRows;
      const { startTime, endTime, adjustment } = selectedRowTimeValues;
      const updatedInput = activityData.activityPatchValidation(
        input,
        startTime,
        endTime,
        adjustment
      );
      if (
        (updatedInput.startTime ||
          updatedInput.endTime ||
          updatedInput.adjustment) &&
        selectedRows.length > 1
      ) {
        alert("Can't patch multiple entries with different times.");
        setSelectedRows([]);
        setSelectedRowTimeValues({
          startTime: "",
          endTime: "",
          adjustment: 0,
        });
        resetForm();
        setIsLoading(false);
        return;
      }
      await SDK.patchUserActivityData(userId, idsToPatch, updatedInput);
      setSelectedRows([]);
      setSelectedRowTimeValues({
        startTime: "",
        endTime: "",
        adjustment: 0,
      });
      resetForm();
      fetchUserActivityData();
    } catch (error) {
      console.error(error);
      setSelectedRows([]);
      setSelectedRowTimeValues({
        startTime: null,
        endTime: null,
        adjustment: 0,
      });
    }
    resetForm();
    setIsLoading(false);
  };

  const submit = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsLoading(true);
    if (isSearchMode) {
      await submitSearch(event);
    } else if (selectedRows.length > 0 && !isSearchMode) {
      await submitPatch(event);
    } else {
      try {
        const updatedInput = activityData.activityEntryValidation(input);
        if (!input.category) {
          alert("Mandatory field: Category");
          resetForm();
          setIsLoading(false);
          return;
        }
        await SDK.postUserActivityData(userId, updatedInput);
        fetchUserActivityData();
      } catch (error) {
        console.error(error);
      }
      resetForm();
    }
    setIsLoading(false);
  };

  const {
    selectedRows,
    selectedRowTimeValues,
    handleRowClick,
    deleteSelected,
    setSelectedRows,
    setSelectedRowTimeValues,
  } = useRowNavigation(
    userId,
    userActivityData,
    fetchUserActivityData,
    submit,
    setIsLoading
  );

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

  const openSidebar = () => {
    setShowSidebar(true);
  };

  function timeStringToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      <div className="absolute z-50 mt-[50vh] bg-secondary text-white rounded-r-md">
        {!showSidebar && (
          <button className="ml-1 mt-1" onClick={openSidebar}>
            <MdMenuOpen />
          </button>
        )}
      </div>
      <div className="z-40">
        <Sidebar
          userId={userId}
          isMobile={isMobile}
          submit={submit}
          remove={deleteSelected}
          displayInstructions={displayInstructions}
          setDisplayInstructions={setDisplayInstructions}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
      </div>
      <main
        className={`flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2 xs:max-w-full sm:max-w-[2000px] ${
          showSidebar && "ml-16"
        }`}
      >
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white mr-5 flex justify-between items-center">
          My Tally
          <span className="text-sm flex">
            {!isMobile && (
              <button
                className="btn bg-custom-databg btn-sm mr-2 w-10 border-gray-800 hover:bg-primary"
                onClick={() => setShowUTC(!showUTC)}
              >
                <MdAccessTimeFilled />
              </button>
            )}
            {!isMobile && <UploadCSVbtn />}
            {!isMobile && <DownloadCSV DownloadCSV userId={userId} />}
          </span>
        </h1>

        <div className="">
          <div className="sticky top-1">
            <section id="input-header" className="">
              <form ref={formRef} onSubmit={submit}>
                <table
                  id="input-table"
                  className="sm:min-w-[1400px] w-full text-white text-sm mr-5 rounded-[7px] bg-gray-800"
                >
                  <thead>
                    <tr>
                      {!isMobile && <th>Entry/Search</th>}
                      {!isMobile && <th>DATE</th>}
                      {!isMobile && <th>DESCRIPTION</th>}
                      <th>CATEG</th>
                      <th>SUBCAT</th>
                      <th>START</th>
                      <th>END</th>
                      {!isMobile && <th>ADJ</th>}
                      <th>TIME</th>
                      {showUTC && !isMobile && (
                        <>
                          <th>UTC</th>
                          <th>CREATED UTC</th>
                          <th>UPDATED UTC</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {!isMobile && (
                        <td>
                          {" "}
                          <EntrySearchToggleButton
                            isSearchMode={isSearchMode}
                            handleClick={handleToggleClick}
                          />
                        </td>
                      )}
                      {!isMobile && (
                        <td className="input-name">
                          <input
                            name="date"
                            type="date"
                            className="data-input"
                            onChange={handleInputChange}
                          />
                        </td>
                      )}
                      {!isMobile && (
                        <td>
                          <input
                            name="description"
                            type="text"
                            className={`data-input description-input ${
                              selectedRows.length > 0
                                ? "description-editMode"
                                : ""
                            } ${isSearchMode ? "description-searchMode" : ""}`}
                            onChange={handleInputChange}
                            placeholder={
                              selectedRows.length > 0
                                ? "Edit Mode"
                                : isSearchMode
                                ? "Search Mode"
                                : "Entry Mode"
                            }
                          />
                        </td>
                      )}
                      <td>
                        <select
                          name="category"
                          className="data-input"
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          <option value="GENERAL">GENERAL</option>
                          <option value="WORK">WORK</option>
                          <option value="CORE">CORE</option>
                          <option value="LEARN">LEARN</option>
                          <option value="BUILD">BUILD</option>
                          <option value="RECOVERY">RECOVERY</option>
                        </select>
                      </td>
                      <td>
                        {isSearchMode ? (
                          <input
                            name="subcategory"
                            type="text"
                            className="data-input"
                            onChange={handleInputChange}
                          />
                        ) : input.category === "CORE" ? (
                          <select
                            name="subcategory"
                            className="data-input"
                            onChange={handleInputChange}
                            value={input.subcategory || ""}
                          >
                            <option value="">Select</option>
                            <option value="SLEEP">SLEEP</option>
                            <option value="EAT">EAT</option>
                            <option value="GROOM">GROOM</option>
                            <option value="FITNESS">FITNESS</option>
                            <option value="RELIEF">RELIEF</option>
                            <option value="INFORM">INFORM</option>
                          </select>
                        ) : (
                          <select
                            name="subcategory"
                            className="data-input"
                            onChange={handleInputChange}
                            value={input.subcategory || ""}
                          >
                            <option value="">Select</option>
                            {subcategories[input.category]?.map(
                              (subcat, index) => (
                                <option key={index} value={subcat}>
                                  {subcat}
                                </option>
                              )
                            )}
                          </select>
                        )}
                      </td>
                      <td>
                        <input
                          name="startTime"
                          type="time"
                          className="data-input"
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          name="endTime"
                          type="time"
                          className="data-input"
                          onChange={handleInputChange}
                        />
                      </td>

                      {!isMobile && (
                        <td>
                          <input
                            name="adjustment"
                            type="text"
                            className="data-input"
                            onChange={handleInputChange}
                            placeholder="mins"
                          />
                        </td>
                      )}
                      <td className="text-[13px]">
                        {isSearchMode
                          ? datetimeFnc.convertMinutesToHHMM(queryTimeSum)
                          : "-"}
                      </td>
                      {showUTC && !isMobile && (
                        <>
                          <td></td>
                          <td></td>
                          <td></td>
                        </>
                      )}
                    </tr>
                    {isSearchMode && (
                      <tr>
                        <td></td>
                        <td className="input-name">
                          <input
                            name="date2"
                            type="date"
                            className="data-input"
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </form>
            </section>
          </div>
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-gray-100 p-4 rounded-lg shadow-lg flex items-center justify-center">
                <FaSpinner className="text-4xl text-primary animate-spin" />
              </div>
            </div>
          )}
          {!isLoading &&
            (userActivityData.length === 0 || displayInstructions) && (
              <Instructions pageName="tally" />
            )}
          <div>
            <table
              id="data"
              className="sm:min-w-[1400px] w-full text-white text-[12px] bg-custom-databg rounded-[7px] mr-5 mt-3"
            >
              <tbody>
                {userActivityData.map((activity, index, array) => {
                  const currentStartTime = timeStringToMinutes(
                    activity.startTime
                  );
                  const nextEndTime =
                    index < array.length - 1 &&
                    activity.date === array[index + 1].date
                      ? timeStringToMinutes(array[index + 1].endTime)
                      : null;

                  return (
                    <tr
                      key={activity.id}
                      onClick={(event) =>
                        handleRowClick(
                          activity.id,
                          activity.startTime,
                          activity.endTime,
                          activity.adjustment,
                          event
                        )
                      }
                      style={{
                        backgroundColor: selectedRows.includes(activity.id)
                          ? "#264653"
                          : "transparent",
                        color:
                          nextEndTime !== null && currentStartTime < nextEndTime
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {!isMobile && (
                        <td>{datetimeFnc.getWeekDay(activity.date)}</td>
                      )}
                      {!isMobile && (
                        <td>
                          {datetimeFnc.getDDMMYYYY(activity.date.slice(0, 10))}
                        </td>
                      )}
                      {!isMobile && <td>{activity.description}</td>}
                      <td>{activity.category}</td>
                      <td>{activity.subcategory}</td>
                      <td>{activity.startTime}</td>
                      <td>{activity.endTime}</td>
                      {!isMobile && (
                        <td>
                          {activity.adjustment === 0
                            ? "-"
                            : activity.adjustment}
                        </td>
                      )}
                      <td>
                        {datetimeFnc.convertMinutesToHHMM(
                          activity.totalTimeMin
                        )}
                      </td>
                      {showUTC && !isMobile && (
                        <>
                          <td>{activity.timezone}</td>
                          <td>{`${activity.createdAt.slice(
                            11,
                            16
                          )} ${datetimeFnc.getDDMMYY(
                            activity.createdAt.slice(0, 10)
                          )}`}</td>
                          <td>{`${activity.updatedAt.slice(
                            11,
                            16
                          )} ${datetimeFnc.getDDMMYY(
                            activity.updatedAt.slice(0, 10)
                          )}`}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Members;

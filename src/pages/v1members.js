import { useState, useRef } from "react";
import { useParams } from "react-router-dom";

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

const Members = () => {
  const { userId } = useParams();

  const [showUTC, setShowUTC] = useState(false);
  const [queryTimeSum, setQueryTimeSum] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const { subcategories } = useFetchCategoryConfig(userId);
  const { userActivityData, setUserActivityData, fetchUserActivityData } =
    useUserActivityData(userId, 32);
  const isMobile = useWindowSize();

  // SEARCH MODE
  const handleToggleClick = () => {
    setIsSearchMode((prevMode) => !prevMode);
    if (isSearchMode) {
      fetchUserActivityData();
    }
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
  };

  const submitPatch = async (event) => {
    try {
      console.log("Patching data...");
      const idToPatch = selectedRow;
      const { startTime, endTime, adjustment } = selectedRowTimeValues;
      const updatedInput = activityData.activityPatchValidation(
        input,
        startTime,
        endTime,
        adjustment
      );
      await SDK.patchUserActivityData(userId, idToPatch, updatedInput);
      setSelectedRow(null);
      setSelectedRowTimeValues({
        startTime: "",
        endTime: "",
        adjustment: 0,
      });
      fetchUserActivityData();
    } catch (error) {
      console.error(error);
      setSelectedRow(null);
      setSelectedRowTimeValues({
        startTime: null,
        endTime: null,
        adjustment: 0,
      });
    }
    resetForm();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (isSearchMode) {
      submitSearch(event);
    } else if (selectedRow && !isSearchMode) {
      submitPatch(event);
    } else {
      try {
        const updatedInput = activityData.activityEntryValidation(input);
        if (!input.category) {
          alert("Mandatory field: Category");
          resetForm();
          return;
        }
        await SDK.postUserActivityData(userId, updatedInput);
        fetchUserActivityData();
      } catch (error) {
        console.error(error);
        resetForm();
      }
      resetForm();
    }
  };

  const {
    selectedRow,
    selectedRowTimeValues,
    handleRowClick,
    deleteSelected,
    setSelectedRow,
    setSelectedRowTimeValues,
  } = useRowNavigation(userId, userActivityData, fetchUserActivityData, submit);

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      <Sidebar
        userId={userId}
        isMobile={isMobile}
        submit={submit}
        remove={deleteSelected}
      />
      <main className="flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2 ml-16 xs:max-w-full sm:max-w-[2000px]">
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white mr-5 flex justify-between items-center">
          My Tally
          <span className="text-sm flex">
            {!isMobile && (
              <button
                className="btn bg-custom-databg btn-sm mr-2 w-10 border-gray-800 hover:bg-primary"
                onClick={() => setShowUTC(!showUTC)}
              >
                UTC
              </button>
            )}
            {!isMobile && <UploadCSVbtn />}
            {!isMobile && <DownloadCSV DownloadCSV userId={userId} />}
          </span>
        </h1>

        <div>
          <section id="input-header">
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
                            selectedRow ? "description-editMode" : ""
                          } ${isSearchMode ? "description-searchMode" : ""}`}
                          onChange={handleInputChange}
                          placeholder={
                            selectedRow
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

        <div>
          <table
            id="data"
            className="sm:min-w-[1400px] w-full text-white text-[12px] bg-custom-databg rounded-[7px] mr-5 mt-3"
          >
            <tbody>
              {userActivityData.map((activity) => (
                <tr
                  key={activity.id}
                  onClick={() =>
                    handleRowClick(
                      activity.id,
                      activity.startTime,
                      activity.endTime,
                      activity.adjustment
                    )
                  }
                  style={{
                    backgroundColor:
                      selectedRow === activity.id ? "#264653" : "transparent",
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
                      {activity.adjustment === 0 ? "-" : activity.adjustment}
                    </td>
                  )}
                  <td>
                    {datetimeFnc.convertMinutesToHHMM(activity.totalTimeMin)}
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
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Members;

import "../styles/v1members.css";
import * as SDK from "../sdk_backend_fetch.js";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import activityData from "../functions/activityDataFnc.js";
import datetimeFnc from "../functions/datetimeFnc.js";

import DownloadCSV from "../components/downloadCSVbtn.js";
import UploadCSVbtn from "../components/uploadCSVbtn.js";
import EntrySearchToggleButton from "../components/entrySearchModebtn.js";

const Members = () => {
  const { userId } = useParams();
  const [showUTC, setShowUTC] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [queryTimeSum, setQueryTimeSum] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [subcategories, setSubcategories] = useState({});

  // FETCH CATEGORY CONFIG
  useEffect(() => {
    const fetchCategoryConfig = async () => {
      try {
        const response = await SDK.getUserCategoryConfig(userId);
        setSubcategories(response.user.categConfig.subcategories);
      } catch (error) {
        console.error("Error fetching user category config:", error);
      }
    };

    fetchCategoryConfig();
  }, [userId]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // HANDLE WINDOW SIZE
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // USER ACTIVITY DATA
  const [userActivityData, setUserActivityData] = useState([]);
  const fetchUserActivityData = useCallback(async () => {
    try {
      const data = await SDK.getUserActivityData(userId);
      setUserActivityData(data);
    } catch (error) {
      console.error(error);
    }
  }, [userId]);
  useEffect(() => {
    fetchUserActivityData();
  }, [userId]);
  // useEffect(() => {
  //   if (!isSearchMode) {
  //   }
  // }, [isSearchMode]);

  const [input, setInput] = useState({
    date: null,
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

  // SEARCH MODE
  const handleToggleClick = () => {
    setIsSearchMode((prevMode) => !prevMode);
  };

  // POST ACTIVITY DATA
  const submit = async (event) => {
    event.preventDefault();
    if (isSearchMode) {
      const queryParams = new URLSearchParams();
      if (input.description)
        queryParams.append("description", input.description);
      if (input.category) queryParams.append("category", input.category);
      if (input.subcategory)
        queryParams.append("subcategory", input.subcategory);
      if (input.date) queryParams.append("date", input.date);
      setInput({
        date: null,
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
      try {
        const data = await SDK.queryUserActivityData(userId, queryParams);
        setUserActivityData(data.userActivityData);
        setQueryTimeSum(data.totalSum);
        console.log("Query finished");
      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    } else if (selectedRow && !isSearchMode) {
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
      setInput({
        date: null,
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
    } else {
      try {
        const updatedInput = activityData.activityEntryValidation(input);
        if (!input.category) {
          alert("Mandatory field: Category");
          setInput({
            date: null,
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
          return;
        }
        await SDK.postUserActivityData(userId, updatedInput);
        fetchUserActivityData();
      } catch (error) {
        console.error(error);
        setInput({
          date: null,
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
      }
      setInput({
        date: null,
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
    }
  };

  // SELECTING ROWS AND NAVIGATING WITH ARROW KEYS
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
      return;
    } else {
      if (isSearchMode) {
        setIsSearchMode(false);
      }
      setSelectedRow(id);
      setSelectedRowTimeValues({
        startTime: startTime,
        endTime: endTime,
        adjustment: adjustment,
      });
      console.log("Selected row:", id);
    }
  };

  // EVENT LISTENER TO NAVIGATE ROWS WITH ARROW KEYS
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
        } else if (userActivityData && userActivityData.length > 0) {
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
  }, [selectedRow, userActivityData]); // userActivityData

  // EVENT LISTENER TO UNSELECT ROW WITH ESCAPE KEY
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

  // DELETING CURRENTLY SELECTED ROW WITH DEL PRESS
  const deleteSelected = useCallback(async () => {
    try {
      if (selectedRow) {
        await SDK.deleteUserActivityData(userId, selectedRow);
        fetchUserActivityData();
        setSelectedRow(null);
      } else {
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedRow, fetchUserActivityData, userId, setSelectedRow]);
  const handleDelPress = useCallback(
    (e) => {
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
    },
    [deleteSelected]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleDelPress);
    return () => window.removeEventListener("keydown", handleDelPress);
  }, [handleDelPress]);

  const handleFormSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      submit(e);
    },
    [submit]
  );

  const handleEnterPress = useCallback(
    async (e) => {
      if (e.key === "Enter") {
        handleFormSubmit(e);
      }
    },
    [handleFormSubmit]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEnterPress);
    return () => window.removeEventListener("keydown", handleEnterPress);
  }, [handleEnterPress]);

  const logOut = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // NAVIGATION
  const navigateDashboard = () => {
    window.location.href = `/members/${userId}/dashboard`;
  };
  const navigateCategories = () => {
    window.location.href = `/members/${userId}/categories`;
  };

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      {showSidebar && (
        <nav className="xs:absolute sm:relative xs:h-screen w-36 bg-custom-grey text-white p-4 flex flex-col space-y-4">
          <button className="btn btn-primary" onClick={navigateDashboard}>
            Dashboard
          </button>
          <button className="btn btn-primary">My Tally</button>
          <button className="btn btn-primary" onClick={navigateCategories}>
            Categories
          </button>
          <button className="btn btn-primary">Pending</button>
          <button className="btn btn-primary">Collabs</button>
          <button className="btn btn-primary" onClick={logOut}>
            Log Out
          </button>
          {isMobile ? (
            <button onClick={handleFormSubmit} className="btn btn-primary">
              Enter
            </button>
          ) : null}
          {isMobile ? (
            <button onClick={deleteSelected} className="btn btn-primary">
              Delete
            </button>
          ) : null}
        </nav>
      )}
      <button
        onClick={toggleSidebar}
        className="bg-gray-800 text-white text-sm px-1 py-2 h-10 rounded-none mt-4 rounded-tr-md rounded-br-md z-50"
      >
        {showSidebar ? ">" : "<"}
      </button>

      <main className="flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2">
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white mr-5 flex justify-between items-center">
          My Tally
          <span className="text-sm flex">
            <button
              className="btn bg-custom-databg btn-sm mr-2 w-10 border-gray-800 hover:bg-primary"
              onClick={() => setShowUTC(!showUTC)}
            >
              UTC
            </button>
            <UploadCSVbtn />
            <DownloadCSV DownloadCSV userId={userId} />
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
                    {!isMobile && <th>DAY</th>}
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

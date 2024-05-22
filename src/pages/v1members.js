import "../styles/v1members.css";
import * as SDK from "../sdk_backend_fetch.js";

import { useState, useRef, useEffect, useCallback } from "react";
import activityData from "../functions/activityDataFnc.js";
import { Link, useParams } from "react-router-dom";
import datetimeFnc from "../functions/datetimeFnc.js";

import DownloadCSV from "../components/downloadCSVbtn.js";

const Members = () => {
  const { userId } = useParams();
  const [showUTC, setShowUTC] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  // Handle window resize
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
  const fetchUserActivityData = async () => {
    try {
      const data = await SDK.getUserActivityData(userId);
      setUserActivityData(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUserActivityData();
  }, [userId]);

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
  };

  // POST ACTIVITY DATA
  const submit = async (event) => {
    event.preventDefault();
    if (selectedRow) {
      try {
        const idToPatch = selectedRow;
        const { startTime, endTime, adjustment } = selectedRowTimeValues;
        const updatedInput = activityData.activityPatchValidation(
          input,
          startTime,
          endTime,
          adjustment
        );
        const response = await SDK.patchUserActivityData(
          userId,
          idToPatch,
          updatedInput
        );
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
        const response = await SDK.postUserActivityData(userId, updatedInput);
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
      setSelectedRow(id);
      setSelectedRowTimeValues({
        startTime: startTime,
        endTime: endTime,
        adjustment: adjustment,
      });
      console.log(selectedRowTimeValues);
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
  }, [selectedRow]); // userActivityData

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

  const logOut = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const navigateDashboard = () => {
    window.location.href = `/members/${userId}/dashboard`;
  };

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      {showSidebar && (
        <nav className="xs:absolute sm:relative xs:h-screen w-36 bg-custom-grey text-white p-4 flex flex-col space-y-4">
          <button className="btn btn-primary mt-20" onClick={navigateDashboard}>
            Dashboard
          </button>
          <button className="btn btn-primary">My Tally</button>
          <button className="btn btn-primary">Pending</button>
          <button className="btn btn-primary">Collabs</button>
          <button
            className="btn btn-primary"
            onClick={() => setShowUTC(!showUTC)}
          >
            UTC
          </button>
          <button className="btn btn-primary" onClick={logOut}>
            Log Out
          </button>
          <DownloadCSV DownloadCSV userId={userId} />
        </nav>
      )}
      <button
        onClick={toggleSidebar}
        className="bg-gray-800 text-white text-sm px-1 py-2 h-10 rounded-none mt-4 rounded-tr-md rounded-br-md z-50"
      >
        {showSidebar ? ">" : "<"}
      </button>

      <main className="flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2">
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold mb-4 text-white mr-5">
          Personal Tally
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
                    {!isMobile && <td></td>}
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
                          className="data-input"
                          onChange={handleInputChange}
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
                      <input
                        name="subcategory"
                        type="text"
                        className="data-input"
                        onChange={handleInputChange}
                      />
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
                    <td>
                      <button id="submit-btn" type="submit" className="pr-2">
                        Enter
                      </button>
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

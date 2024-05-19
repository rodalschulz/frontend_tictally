import "../styles/v1members.css";
import * as SDK from "../sdk_backend_fetch.js";

import { useState, useRef, useEffect, useCallback } from "react";
import activityData from "../functions/activityDataFnc.js";
import inputFnc from "../functions/userInputFnc.js";
import { useParams } from "react-router-dom";
import datetimeFnc from "../functions/datetimeFnc.js";

const Members = () => {
  const { userId } = useParams();
  const [showUTC, setShowUTC] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // State variable to manage sidebar visibility

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

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
  }, [userId]); // Fetch data only when userId changes

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

  const submit = async (event) => {
    event.preventDefault();
    if (selectedRow) {
      try {
        const idToPatch = selectedRow;
        const updatedInput = activityData.activityPatchValidation(input);
        const response = await SDK.patchUserActivityData(
          userId,
          idToPatch,
          updatedInput
        );
        fetchUserActivityData();
      } catch (error) {
        console.error(error);
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
          return;
        }
        const response = await SDK.postUserActivityData(userId, updatedInput);
        console.log(response);
        fetchUserActivityData();
      } catch (error) {
        console.error(error);
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
  const handleRowClick = (id) => {
    if (selectedRow === id) {
      setSelectedRow(null);
      return;
    } else {
      setSelectedRow(id);
      console.log(id);
    }
  };
  useEffect(() => {
    // Add event listener for arrow keys
    const handleArrowKeyPress = (e) => {
      // Handle Up and Down arrow keys
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
          }
        } else if (userActivityData && userActivityData.length > 0) {
          setSelectedRow(userActivityData[0].id);
        }
      }
    };
    window.addEventListener("keydown", handleArrowKeyPress);
    return () => {
      window.removeEventListener("keydown", handleArrowKeyPress);
    };
  }, [userActivityData, selectedRow]);

  // DELETING CURRENTLY SELECTED ROW WITH DEL PRESS
  const deleteSelected = useCallback(async () => {
    const idToDelete = selectedRow;
    try {
      if (selectedRow) {
        await SDK.deleteUserActivityData(userId, idToDelete);
        fetchUserActivityData();
        setSelectedRow(null);
      } else {
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedRow, fetchUserActivityData]);
  const handleDelPress = useCallback(
    (e) => {
      if (e.key === "Delete") {
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

  return (
    <div className="flex h-screen">
      {/* Sidebar with toggle button */}
      {showSidebar && (
        <nav className="w-36 bg-custom-grey text-white p-4 flex flex-col space-y-4">
          {/* Your sidebar content */}
          <button className="btn btn-primary mt-20">Dashboard</button>
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
        </nav>
      )}
      <button
        onClick={toggleSidebar}
        className="absolute top-0 right-0 mt-2 mr-4 text-white bg-gray-800 px-2 py-1 text-sm rounded hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1"
      >
        {showSidebar ? ">" : "<"}
      </button>

      <main className="flex-1 p-4">
        <h1 className="text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg">
          Personal Tally
        </h1>

        <div>
          <section id="input-header">
            <form ref={formRef} onSubmit={submit}>
              <table id="input-table" className="min-w-full">
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
          <table id="data" className="min-w-full">
            <tbody>
              {userActivityData.map((activity) => (
                <tr
                  key={activity.id}
                  onClick={() => handleRowClick(activity.id)}
                  style={{
                    backgroundColor:
                      selectedRow === activity.id
                        ? "rgb(25, 45, 51)"
                        : "transparent",
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
                  {!isMobile && <td>{activity.adjustment}</td>}
                  <td>{activity.time}</td>
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

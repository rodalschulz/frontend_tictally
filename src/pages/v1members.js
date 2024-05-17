import "../styles/v1members.css";
import * as SDK from "../sdk_backend_fetch.js";

import { useState, useRef, useEffect } from "react";
import activityData from "../functions/activityDataFnc.js";
import inputFnc from "../functions/userInputFnc.js";
import { useParams } from "react-router-dom";
import datetimeFnc from "../functions/datetimeFnc.js";

const Members = () => {
  const { userId } = useParams();
  const [showUTC, setShowUTC] = useState(false);
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
  };

  const logOut = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen">
      {/* Vertical Navigation Bar */}
      <nav className="w-36 bg-gray-800 text-white p-4 flex flex-col space-y-4">
        <button className="py-2 px-4 bg-gray-700 rounded hover:bg-gray-600">
          My Tally
        </button>
        <button className="py-2 px-4 bg-gray-700 rounded hover:bg-gray-600">
          Pending
        </button>
        <button className="py-2 px-4 bg-gray-700 rounded hover:bg-gray-600">
          Collabs
        </button>
        <button
          className="py-2 px-4 bg-gray-700 rounded hover:bg-gray-600"
          onClick={() => setShowUTC(!showUTC)}
        >
          Show UTC
        </button>
        <button
          className="py-2 px-4 bg-gray-700 rounded hover:bg-gray-600"
          onClick={logOut}
        >
          Log Out
        </button>
      </nav>

      {/* Main Content Section */}
      <main className="flex-1">
        <h1 className="text-2xl">Personal Tally</h1>

        {/* Sticky Table with headers and input row */}
        <div>
          <section id="input-header">
            <form ref={formRef} onSubmit={submit}>
              <table>
                <thead>
                  <tr>
                    <th>DAY</th>
                    <th>DATE</th>
                    <th>DESCRIPTION</th>
                    <th>CATEG</th>
                    <th>SUBCAT</th>
                    <th>START</th>
                    <th>END</th>
                    <th>ADJ</th>
                    <th>TIME</th>
                    {showUTC && (
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
                    <td></td>
                    <td>
                      <input
                        name="date"
                        type="date"
                        className="data-input"
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        name="description"
                        type="text"
                        className="data-input"
                        onChange={handleInputChange}
                      />
                    </td>
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
                    <td>
                      <input
                        name="adjustment"
                        type="text"
                        className="data-input"
                        onChange={handleInputChange}
                        placeholder="mins"
                      />
                    </td>
                    <td>
                      <button id="submit-btn" type="submit">
                        Submit
                      </button>
                    </td>
                    {showUTC && (
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
          <table id="data">
            <tbody>
              {userActivityData.map((activity) => (
                <tr key={activity.id}>
                  <td>{datetimeFnc.getWeekDay(activity.date)}</td>
                  <td>{datetimeFnc.getDDMMYYYY(activity.date.slice(0, 10))}</td>
                  <td>{activity.description}</td>
                  <td>{activity.category}</td>
                  <td>{activity.subcategory}</td>
                  <td>{activity.startTime}</td>
                  <td>{activity.endTime}</td>
                  <td>{activity.adjustment}</td>
                  <td>{activity.time}</td>
                  {showUTC && (
                    <>
                      <td>{activity.timezone}</td>
                      <td>
                        {`${activity.createdAt.slice(
                          11,
                          16
                        )} ${datetimeFnc.getDDMMYY(
                          activity.createdAt.slice(0, 10)
                        )}`}
                      </td>
                      <td>
                        {`${activity.updatedAt.slice(
                          11,
                          16
                        )} ${datetimeFnc.getDDMMYY(
                          activity.updatedAt.slice(0, 10)
                        )}`}
                      </td>
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

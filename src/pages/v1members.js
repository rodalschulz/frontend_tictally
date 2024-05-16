import "../styles/v1members.css";

import * as SDK from "../sdk_backend_fetch.js";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";

const Members = () => {
  const dateInputRef = useRef(null);
  const categoryInputRef = useRef(null);

  // GETTING DATA
  const { userId } = useParams();
  const [userActivityData, setUserActivityData] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const data = await SDK.getUserActivityData(userId);
      setUserActivityData(data);
    } catch (error) {
      console.error(error);
    }
  }, [setUserActivityData, userId]);
  useEffect(() => {
    fetchData(); // Fetch data every 20 seconds
    const intervalId = setInterval(fetchData, 20000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const [inData, setInData] = useState({
    day: "MON",
    date: null,
    category: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInData({
      ...inData,
      [name]: value,
    });
  };
  const submit = async (event) => {
    event.preventDefault();
    console.log(inData);
    setInData({
      day: "MON",
      date: null,
      category: "",
    });
    dateInputRef.current.value = null;
    categoryInputRef.current.value = "";
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
        <button className="py-2 px-4 bg-gray-700 rounded hover:bg-gray-600">
          Profile
        </button>
      </nav>

      {/* Main Content Section */}
      <main className="flex-1">
        <h1 className="text-2xl">Personal Tally</h1>

        {/* Sticky Table with headers and input row */}
        <div>
          <section id="input-header">
            <form>
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
                    <th>CREATED</th>
                    <th>UPDATED</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td>
                      <input
                        type="date"
                        className="data-input"
                        onChange={handleInputChange}
                        name="date"
                        ref={dateInputRef}
                      />
                    </td>
                    <td>
                      <input type="text" className="data-input" />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="data-input"
                        onChange={handleInputChange}
                        name="category"
                        ref={categoryInputRef}
                      />
                    </td>
                    <td>
                      <input type="text" className="data-input" />
                    </td>
                    <td>
                      <input type="time" className="data-input" />
                    </td>
                    <td>
                      <input type="time" className="data-input" />
                    </td>
                    <td>
                      <input type="" className="data-input" placeholder="" />
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                      <button id="submit-btn" onClick={submit}>
                        Submit
                      </button>
                    </td>
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
                  <td>{activity.day}</td>
                  <td>{activity.date}</td>
                  <td>{activity.description}</td>
                  <td>{activity.category}</td>
                  <td>{activity.subcategory}</td>
                  <td>{activity.startTime}</td>
                  <td>{activity.endTime}</td>
                  <td>{activity.adjustment}</td>
                  <td>{activity.time}</td>
                  <td>{activity.createdAt}</td>
                  <td>{activity.updatedAt}</td>
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

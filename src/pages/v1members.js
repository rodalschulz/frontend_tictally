import "../styles/v1members.css";

import * as SDK from "../sdk_backend_fetch.js";
import { useEffect, useState, useCallback, useRef } from "react";

const Members = () => {
  const dateInputRef = useRef(null);
  const categoryInputRef = useRef(null);

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
              <tr>
                <td>MON</td>
                <td>01/01/2023</td>
                <td>
                  Meeting with team because bla bla and this is a long text that
                  i need to input to test the user interface and this text could
                  be even longer
                </td>
                <td>GENERAL</td>
                <td>SMOKEBLOCK</td>
                <td>09:00</td>
                <td>10:00</td>
                <td>None</td>
                <td>00:00</td>
                <td>00:00  12/31/2022</td>
                <td>00:00  12/31/2022</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Members;

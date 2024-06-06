import { useState, useRef } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../components/sidebar.js";
import useWindowSize from "../baseComponents/useWindowSize.js";
import Instructions from "../components/instructions.js";
import * as SDK from "../sdk_backend_fetch.js";
import pendingValidation from "../functions/pendingValidation.js";
import useFetchPendingTasks from "../baseComponents/useFetchPendingTasks.js";
import datetimeFnc from "../functions/datetimeFnc.js";

import "../styles/v1pending.css";

const Pending = () => {
  const { userId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const { pendingTasks, setPendingTasks, fetchPendingTasks } =
    useFetchPendingTasks(userId, 15, setIsLoading);
  const isMobile = useWindowSize();
  const [displayInstructions, setDisplayInstructions] = useState(false);

  const [input, setInput] = useState({
    date: null,
    time: null,
    description: null,
    relevance: "",
    urgency: "",
    recurring: "",
    periodRecurrence: "",
  });
  const formRef = useRef(null);

  const resetForm = () => {
    setInput({
      date: null,
      time: null,
      description: null,
      relevance: "",
      urgency: "",
      recurring: "",
      periodRecurrence: "",
    });
    if (formRef.current) {
      formRef.current.reset();
    }
  };

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
      const updatedInput = pendingValidation.pendingEntryValidation(input);
      resetForm();
      await SDK.postUserPendingTask(userId, updatedInput);
      fetchPendingTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      <Sidebar
        userId={userId}
        isMobile={isMobile}
        // submit={submit}
        // remove={deleteSelected}
        displayInstructions={displayInstructions}
        setDisplayInstructions={setDisplayInstructions}
      />

      <main className="flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2 ml-16 xs:max-w-full sm:max-w-[2000px]">
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white mr-5 flex justify-between items-center">
          Pending Tasks
        </h1>

        <div className="">
          <div>
            <form ref={formRef} onSubmit={submit}>
              <table
                id="input-table-pending"
                className="sm:min-w-[1400px] w-full text-white text-sm mr-5 rounded-[7px] bg-gray-800"
              >
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Description</th>
                    <th>Relevance</th>
                    <th>Urgency</th>
                    <th>Recurring</th>
                    <th>Period</th>
                    <th>Completed</th>
                    <th>Buttons</th>
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
                        name="time"
                        type="time"
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
                        name="relevance"
                        className="data-input"
                        value={input.relevance}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="HIGH">HIGH</option>
                        <option value="NORMAL">NORMAL</option>
                        <option value="LOW">LOW</option>
                      </select>
                    </td>
                    <td>
                      <select
                        name="urgency"
                        className="data-input"
                        value={input.urgency}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="HIGH">HIGH</option>
                        <option value="NORMAL">NORMAL</option>
                        <option value="LOW">LOW</option>
                      </select>
                    </td>
                    <td>
                      <select
                        name="recurring"
                        className="data-input"
                        value={input.recurring}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value={true}>YES</option>
                        <option value={false}>NO</option>
                      </select>
                    </td>
                    <td>
                      <select
                        name="periodRecurrence"
                        className="data-input"
                        value={input.periodRecurrence}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="MONTHLY">MONTHLY</option>
                        <option value="YEARLY">YEARLY</option>
                      </select>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
          <div>
            <table
              id="output-table-pending"
              className="sm:min-w-[1400px] w-full text-white text-[12px] bg-custom-databg rounded-[7px] mr-5 mt-3"
            >
              <tbody>
                {pendingTasks &&
                  pendingTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{datetimeFnc.getWeekDay(task.date)}</td>
                      <td>
                        {task.date
                          ? datetimeFnc.getDDMMYYYY(task.date.slice(0, 10))
                          : ""}
                      </td>
                      <td>{task.time ? task.time : "No time"}</td>
                      <td>{task.description}</td>
                      <td>{task.relevance ? task.relevance : ""}</td>
                      <td>{task.urgency}</td>
                      <td>{task.recurring ? task.recurring : ""}</td>
                      <td>{task.periodRecurrence}</td>
                      <td>{task.completed ? task.completed : "Pending"}</td>
                      <td></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pending;

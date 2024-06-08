import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

import Sidebar from "../components/sidebar.js";
import useWindowSize from "../baseComponents/useWindowSize.js";
import Instructions from "../components/instructions.js";
import * as SDK from "../sdk_backend_fetch.js";
import pendingValidation from "../functions/pendingValidation.js";
import useFetchPendingTasks from "../baseComponents/useFetchPendingTasks.js";
import datetimeFnc from "../functions/datetimeFnc.js";
import useRowNavigation from "../baseComponents/useRowNavigation.js";

import "../styles/v1pending.css";

const Pending = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const daysForward = 14;
  const nowStart = new Date();
  nowStart.setDate(nowStart.getDate() - 1);
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + daysForward);

  const { pendingTasks, setPendingTasks, fetchPendingTasks } =
    useFetchPendingTasks(userId, 365, setIsLoading);
  const isMobile = useWindowSize();
  const [displayInstructions, setDisplayInstructions] = useState(false);

  const [input, setInput] = useState({
    date: null,
    time: "",
    description: "",
    relevance: "",
    urgency: "",
    recurring: "",
    periodRecurrence: "",
  });
  const formRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const pendingTasksMod = pendingTasks.map((task) => {
    if (task.recurring) {
      let date = new Date(task.date);
      date.setFullYear(currentYear);
      task.date = date.toISOString();
    }
    return task;
  });
  pendingTasksMod.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(a.date) - new Date(b.date);
    } else if (a.date && !b.date) {
      return -1;
    } else if (!a.date && b.date) {
      return 1;
    } else {
      return 0;
    }
  });

  const adhoc = pendingTasksMod.filter(
    (task) => !task.date && !task.time && !task.state
  );
  const upcoming = pendingTasksMod.filter(
    (task) =>
      task.date &&
      !task.state &&
      new Date(task.date) >= nowStart &&
      new Date(task.date) <= futureDate
  );
  const recentDoneOrExpired = pendingTasksMod.filter((task) =>
    task.date && task.state
      ? new Date(task.date) < now
      : task.date && !task.recurring
      ? new Date(task.date) < nowStart
      : task.state && new Date(task.updatedAt) <= now
  );
  const farOff = pendingTasksMod.filter(
    (task) =>
      task.date &&
      !task.state &&
      !task.recurring &&
      new Date(task.date) > futureDate
  );
  const allRecurring = pendingTasksMod.filter((task) => task.recurring);

  const resetForm = () => {
    setInput({
      date: null,
      time: "",
      description: "",
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
    console.log(input);
  };

  const submitPatch = async (event) => {
    setIsLoading(true);
    try {
      const updatedInput = pendingValidation.pendingPatchValidation(input);
      console.log(`Updated Input: ${JSON.stringify(updatedInput)}`);
      await SDK.patchUserPendingTask(userId, selectedRows, updatedInput);
      fetchPendingTasks();
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedRows([]);
      resetForm();
      setIsLoading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (selectedRows.length > 0) {
      console.log("Submitting Patch");
      await submitPatch(event);
    } else {
      try {
        console.log(`Input: ${JSON.stringify(input)}`);
        const updatedInput = pendingValidation.pendingEntryValidation(input);
        console.log(`Updated Input: ${JSON.stringify(updatedInput)}`);
        await SDK.postUserPendingTask(userId, updatedInput);
        fetchPendingTasks();
      } catch (error) {
        console.error(error);
      } finally {
        resetForm();
        setIsLoading(false);
      }
    }
  };

  const submitDonePatch = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (selectedRows.length === 0) {
      alert("Select a task to mark as done.");
      setIsLoading(false);
      return;
    } else {
      try {
        const updatedInput = { state: true };
        await SDK.patchUserPendingTask(userId, selectedRows, updatedInput);
        fetchPendingTasks();
      } catch (error) {
        console.error(error);
      } finally {
        setSelectedRows([]);
        setIsLoading(false);
      }
    }
  };

  const { selectedRows, setSelectedRows, handleRowClick, deleteSelected } =
    useRowNavigation(
      userId,
      pendingTasks,
      fetchPendingTasks,
      submit,
      setIsLoading
    );

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
                    <th>State</th>
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
                        <option value="AVG">AVG</option>
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
                        <option value="AVG">AVG</option>
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
                        <option value={"true"}>YES</option>
                        <option value={"false"}>NO</option>
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
                        <option value="YEARLY">YEARLY</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={submitDonePatch}
                        className="bg-primary px-2 py-1 pw-1 rounded-lg hover:bg-custom-databg"
                      >
                        <FaCheck />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-gray-100 p-4 rounded-lg shadow-lg flex items-center justify-center">
                <FaSpinner className="text-4xl text-primary animate-spin" />
              </div>
            </div>
          )}
          {!isLoading && (pendingTasks.length === 0 || displayInstructions) && (
            <Instructions pageName="pendingTasks" />
          )}
          <div className="pt-2 pb-4 mt-3 rounded-md">
            <h2 className="pl-2 font-bold text-gray-500">Ad-hoc</h2>
            <div className="mt-1">
              <table
                id="output-table-pending"
                className="sm:min-w-[1400px] w-full text-white text-[12px] bg-custom-databg rounded-[7px]"
              >
                <tbody>
                  {pendingTasks &&
                    adhoc.map((task) => (
                      <tr
                        key={task.id}
                        onClick={(event) =>
                          handleRowClick(task.id, "", "", "", event)
                        }
                        style={{
                          backgroundColor: selectedRows.includes(task.id)
                            ? "#264653"
                            : "transparent",
                        }}
                      >
                        <td className=""></td>
                        <td className=""></td>
                        <td className=""></td>
                        <td>{task.description}</td>
                        <td>{task.relevance ? task.relevance : ""}</td>
                        <td>{task.urgency}</td>
                        <td>{task.recurring ? "TRUE" : ""}</td>
                        <td>{task.periodRecurrence}</td>
                        <td>{task.state ? "Done" : "Pending"}</td>
                        <td></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <h2 className="pl-2 mt-3 font-bold text-gray-500">Upcoming</h2>
            <div className="mt-1">
              <table
                id="output-table-pending"
                className="sm:min-w-[1400px] w-full text-white text-[12px] bg-custom-databg rounded-[7px]"
              >
                <tbody>
                  {pendingTasks &&
                    upcoming.map((task) => (
                      <tr
                        key={task.id}
                        onClick={(event) =>
                          handleRowClick(task.id, "", "", "", event)
                        }
                        style={{
                          backgroundColor: selectedRows.includes(task.id)
                            ? "#264653"
                            : "transparent",
                          color: new Date(task.date) < now ? "cyan" : "white",
                          fontWeight:
                            new Date(task.date) < now && task.recurring
                              ? "bold"
                              : "normal",
                        }}
                      >
                        <td>{datetimeFnc.getWeekDay(task.date)}</td>
                        <td>
                          {task.date
                            ? datetimeFnc.getDDMMYYYY(task.date.slice(0, 10))
                            : ""}
                        </td>
                        <td>{task.time ? task.time : ""}</td>
                        <td>{task.description}</td>
                        <td>{task.relevance ? task.relevance : ""}</td>
                        <td>{task.urgency}</td>
                        <td>{task.recurring ? "TRUE" : ""}</td>
                        <td>{task.periodRecurrence}</td>
                        <td>{task.state ? "Done" : "Pending"}</td>
                        <td></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="bg-secondary text-secondary mt-3 h-1 rounded-lg"> </p>
          <div className="pt-2 pb-4 mt-3 rounded-md">
            <h2 className="pl-2 font-bold text-gray-500">Recent</h2>
            <div className="mt-1">
              <table
                id="output-table-pending"
                className="sm:min-w-[1400px] w-full text-gray-300 text-[12px] bg-custom-databg rounded-[7px]"
              >
                <tbody>
                  {pendingTasks &&
                    recentDoneOrExpired.map((task) => (
                      <tr
                        key={task.id}
                        onClick={(event) =>
                          handleRowClick(task.id, "", "", "", event)
                        }
                        style={{
                          backgroundColor: selectedRows.includes(task.id)
                            ? "#264653"
                            : "transparent",
                        }}
                      >
                        <td>
                          {task.date && datetimeFnc.getWeekDay(task.date)}
                        </td>
                        <td>
                          {task.date
                            ? datetimeFnc.getDDMMYYYY(task.date.slice(0, 10))
                            : ""}
                        </td>
                        <td>{task.time ? task.time : ""}</td>
                        <td>{task.description}</td>
                        <td>{task.relevance ? task.relevance : ""}</td>
                        <td>{task.urgency}</td>
                        <td>{task.recurring ? "TRUE" : ""}</td>
                        <td>{task.periodRecurrence}</td>
                        <td>{task.state ? "Done" : "Pending"}</td>
                        <td></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <h2 className="pl-2 mt-3 font-bold text-gray-500">Far-Off</h2>
            <div className="mt-1">
              <table
                id="output-table-pending"
                className="sm:min-w-[1400px] w-full text-white text-[12px] bg-custom-databg rounded-[7px]"
              >
                <tbody>
                  {pendingTasks &&
                    farOff.map((task) => (
                      <tr
                        key={task.id}
                        onClick={(event) =>
                          handleRowClick(task.id, "", "", "", event)
                        }
                        style={{
                          backgroundColor: selectedRows.includes(task.id)
                            ? "#264653"
                            : "transparent",
                        }}
                      >
                        <td>{datetimeFnc.getWeekDay(task.date)}</td>
                        <td>
                          {task.date
                            ? datetimeFnc.getDDMMYYYY(task.date.slice(0, 10))
                            : ""}
                        </td>
                        <td>{task.time ? task.time : ""}</td>
                        <td>{task.description}</td>
                        <td>{task.relevance ? task.relevance : ""}</td>
                        <td>{task.urgency}</td>
                        <td>{task.recurring ? "TRUE" : ""}</td>
                        <td>{task.periodRecurrence}</td>
                        <td>{task.state ? "Done" : "Pending"}</td>
                        <td></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="bg-secondary text-secondary mt-3 h-1 rounded-lg"> </p>
          <div className="pt-2 pb-4 mt-3 rounded-md">
            <h2 className="pl-2 font-bold text-gray-500">Recurring</h2>
            <div className="mt-1">
              <table
                id="output-table-pending"
                className="sm:min-w-[1400px] w-full text-white text-[12px] bg-custom-databg rounded-[7px]"
              >
                <tbody>
                  {pendingTasks &&
                    allRecurring.map((task) => (
                      <tr
                        key={task.id}
                        onClick={(event) =>
                          handleRowClick(task.id, "", "", "", event)
                        }
                        style={{
                          backgroundColor: selectedRows.includes(task.id)
                            ? "#264653"
                            : "transparent",
                        }}
                      >
                        <td>
                          {task.date && datetimeFnc.getWeekDay(task.date)}
                        </td>
                        <td>
                          {task.date
                            ? datetimeFnc.getDDMMYYYY(task.date.slice(0, 10))
                            : ""}
                        </td>
                        <td>{task.time ? task.time : ""}</td>
                        <td>{task.description}</td>
                        <td>{task.relevance ? task.relevance : ""}</td>
                        <td>{task.urgency}</td>
                        <td>{task.recurring ? "TRUE" : ""}</td>
                        <td>
                          {task.periodRecurrence ? task.periodRecurrence : ""}
                        </td>
                        <td>{task.state ? "Done" : "Pending"}</td>
                        <td></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pending;

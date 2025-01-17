import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaSpinner, FaCheck } from "react-icons/fa";
import { MdMenuOpen } from "react-icons/md";

import {
  postUserPendingTask,
  patchUserPendingTask,
} from "../sdk_backend_fetch.js";
import Sidebar from "../components/sidebar.js";
import Instructions from "../components/instructions.js";
import CategDropdown from "../components/categDropdown.js";
import PopupInstructions from "../components/popupInstructions.js";
import HoverableRowGuide from "../components/hoverableRow.js";
import useWindowSize from "../hooks/useWindowSize.js";
import useFetchPendingTasks from "../hooks/useFetchPendingTasks.js";
import useRowNavigation from "../hooks/useRowNavigation.js";
import useCurrTimeData from "../hooks/useCurrTimeData.js";
import pendingValidation from "../utils/pendingValidation.js";
import datetimeFnc from "../utils/datetimeUtl.js";
import "../styles/v1pending.css";

const Pending = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [displayInstructions, setDisplayInstructions] = useState(false);
  const isMobile = useWindowSize();
  const [hoveredHeader, setHoveredHeader] = useState(null);
  const [popupText, setPopupText] = useState("");

  const { pendingTasks, fetchPendingTasks, dataFetched } = useFetchPendingTasks(
    userId,
    365,
    setIsLoading
  );
  const { nowStart, now, futureDate } = useCurrTimeData();
  const storedCats = JSON.parse(localStorage.getItem("selectedCategories"));
  const categories =
    storedCats && storedCats.length > 0
      ? localStorage.getItem("selectedCategories")
      : ["GENERAL", "WORK", "CORE", "LEARN", "BUILD", "RECOVERY"];
  const [selectedCategories, setSelectedCategories] = useState(categories);

  const [input, setInput] = useState({
    date: null,
    time: "",
    description: "",
    category: "",
    relevUrgen: "",
    periodRecurrence: "",
  });
  const formRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const resetForm = () => {
    setInput({
      date: null,
      time: "",
      description: "",
      relevUrgen: "",
      periodRecurrence: "",
    });
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const tasksModCategFiltered = pendingTasks.filter((task) =>
    selectedCategories.includes(task.category)
  );

  const adhoc = tasksModCategFiltered.filter(
    (task) => !task.date && !task.time && !task.state
  );
  const upcoming = tasksModCategFiltered.filter(
    (task) =>
      task.date &&
      !task.state &&
      new Date(task.date) >= nowStart &&
      new Date(task.date) <= futureDate
  );
  const recentDoneOrExpired = tasksModCategFiltered.filter((task) =>
    task.date && task.state
      ? new Date(task.date) < now
      : task.date && !task.periodRecurrence
      ? new Date(task.date) < nowStart
      : task.state && new Date(task.updatedAt) <= now
  );
  const farOff = tasksModCategFiltered.filter(
    (task) =>
      task.date &&
      !task.state &&
      !task.periodRecurrence &&
      new Date(task.date) > futureDate
  );
  const allRecurring = tasksModCategFiltered.filter(
    (task) => task.periodRecurrence
  );

  // Check for recurring tasks that are done and update state to "Pending"
  const recurringDoneCheck = async () => {
    let recurringDoneIds = [];
    for (const task of allRecurring) {
      if (task.state) {
        if (new Date(task.updatedAt) < nowStart) {
          recurringDoneIds.push(task.id);
        }
      }
    }
    try {
      const updatedInput = { state: false };
      await patchUserPendingTask(userId, recurringDoneIds, updatedInput);
    } catch (error) {
      console.error(error);
    }
  };

  const submitPatch = async (event) => {
    setIsLoading(true);
    try {
      const updatedInput = pendingValidation.pendingPatchValidation(input);
      console.log(`Updated Input: ${JSON.stringify(updatedInput)}`);
      await patchUserPendingTask(userId, selectedRows, updatedInput);
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
        await postUserPendingTask(userId, updatedInput);
        fetchPendingTasks();
        resetForm();
      } catch (error) {
        console.error(error);
      } finally {
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
        await patchUserPendingTask(userId, selectedRows, updatedInput);
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

  const openSidebar = () => {
    setShowSidebar(true);
  };

  useEffect(() => {
    recurringDoneCheck();
  }, [dataFetched]);

  return (
    <div className="flex h-screen bg-zinc-950 overflow-x-auto">
      <div className="absolute z-50 mt-[50vh] bg-secondary text-gray-300 rounded-r-md">
        {!showSidebar && (
          <button className="ml-1 mt-1" onClick={openSidebar}>
            <MdMenuOpen />
          </button>
        )}
      </div>
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
      <main
        className={`flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2 xs:max-w-full sm:max-w-[2000px] ${
          showSidebar && "ml-16"
        }`}
      >
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white mr-5 flex justify-between items-center">
          Pending Tasks
        </h1>

        <div className="">
          <div>
            <form ref={formRef} onSubmit={submit}>
              <table
                id="input-table-pending"
                className="sm:min-w-[1400px] w-full text-white text-sm mr-5 rounded-[7px] bg-zinc-900"
              >
                <thead>
                  <HoverableRowGuide
                    setHoveredHeader={setHoveredHeader}
                    setPopupText={setPopupText}
                  >
                    {!isMobile && <th></th>}
                    <th>
                      Date{" "}
                      {hoveredHeader === "Date" && (
                        <PopupInstructions text={popupText} />
                      )}
                    </th>
                    <th>
                      Time{" "}
                      {hoveredHeader === "Time" && (
                        <PopupInstructions text={popupText} />
                      )}
                    </th>
                    <th>Description</th>
                    <th>
                      Category{" "}
                      {hoveredHeader === "Category" && (
                        <PopupInstructions text={popupText} />
                      )}
                    </th>
                    {!isMobile && (
                      <th>
                        Relev | Urgen{" "}
                        {hoveredHeader === "Relev | Urgen" && (
                          <PopupInstructions text={popupText} />
                        )}
                      </th>
                    )}
                    {!isMobile && <th>Period</th>}
                    {!isMobile && <th>State</th>}
                  </HoverableRowGuide>
                </thead>
                <tbody>
                  <tr>
                    {!isMobile && <td></td>}
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
                        name="category"
                        className="data-input"
                        value={input.category}
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

                    {!isMobile && (
                      <td>
                        <select
                          name="relevUrgen"
                          className="data-input"
                          value={input.relevUrgen}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          <option value="HIGH | HIGH">HIGH | HIGH</option>
                          <option value="HIGH | AVG">HIGH | AVG</option>
                          <option value="HIGH | LOW">HIGH | LOW</option>
                          <option value="AVG | HIGH">AVG | HIGH</option>
                          <option value="AVG | AVG">AVG | AVG</option>
                          <option value="AVG | LOW">AVG | LOW</option>
                          <option value="LOW | HIGH">LOW | HIGH</option>
                          <option value="LOW | AVG">LOW | AVG</option>
                          <option value="LOW | LOW">LOW | LOW</option>
                        </select>
                      </td>
                    )}
                    {!isMobile && (
                      <td>
                        <select
                          name="periodRecurrence"
                          className="data-input"
                          value={input.periodRecurrence}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          <option value="YEARLY">YEARLY</option>
                          <option value="MONTHLY">MONTHLY</option>
                        </select>
                      </td>
                    )}
                    {!isMobile && (
                      <td>
                        <button
                          onClick={submitDonePatch}
                          className="bg-primary px-2 py-1 pw-1 rounded-lg hover:bg-custom-databg"
                        >
                          <FaCheck />
                        </button>
                      </td>
                    )}
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
          {!isLoading && displayInstructions && (
            <Instructions pageName="pendingTasks" />
          )}
          <div className="pt-2 pb-4 rounded-md">
            <div className="mt-1 mb-3 w-fit">
              <CategDropdown
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            </div>
            {adhoc.length > 0 && (
              <h2 className="pl-2 font-bold text-gray-300">Ad-hoc</h2>
            )}
            <div className="mt-1">
              <table
                id="output-table-pending"
                className="sm:min-w-[1400px] w-full text-gray-300 text-[12px] bg-custom-databg rounded-[7px]"
              >
                <tbody>
                  {pendingTasks &&
                    adhoc.map((task) => (
                      <tr
                        key={task.id}
                        onClick={(event) =>
                          handleRowClick(task.id, "", "", "", "", input, event)
                        }
                        style={{
                          backgroundColor: selectedRows.includes(task.id)
                            ? "#264653"
                            : "transparent",
                        }}
                      >
                        {!isMobile && <td className=""></td>}
                        <td className=""></td>
                        <td className=""></td>
                        <td>{task.description}</td>

                        <td>{task.category ? task.category : ""}</td>
                        {!isMobile && <td>{task.relevUrgen}</td>}
                        {!isMobile && <td>{task.periodRecurrence}</td>}

                        {!isMobile && (
                          <td>{task.state ? "Done" : "Pending"}</td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {upcoming.length > 0 && (
              <h2 className="pl-2 mt-3 font-bold text-gray-300">Upcoming</h2>
            )}
            <div className="mt-1">
              <table
                id="output-table-pending"
                className="sm:min-w-[1400px] w-full text-gray-300 text-[12px] bg-custom-databg rounded-[10px]"
              >
                <tbody>
                  {pendingTasks &&
                    upcoming.map((task) => (
                      <tr
                        key={task.id}
                        onClick={(event) =>
                          handleRowClick(task.id, "", "", "", "", input, event)
                        }
                        style={{
                          backgroundColor: selectedRows.includes(task.id)
                            ? "#264653"
                            : new Date(task.date) < now
                            ? "#CDA213"
                            : "transparent",
                          fontWeight:
                            new Date(task.date) < now && task.periodRecurrence
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {!isMobile && (
                          <td>{datetimeFnc.getWeekDay(task.date)}</td>
                        )}
                        <td>
                          {task.date
                            ? datetimeFnc.getDDMMYYYY(task.date.slice(0, 10))
                            : ""}
                        </td>
                        <td>{task.time ? task.time : ""}</td>
                        <td>{task.description}</td>
                        <td>{task.category ? task.category : ""}</td>
                        {!isMobile && <td></td>}
                        {!isMobile && <td>{task.periodRecurrence}</td>}
                        {!isMobile && (
                          <td>{task.state ? "Done" : "Pending"}</td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {(recentDoneOrExpired.length > 0 || farOff.length > 0) && (
            <p className="bg-secondary text-secondary mt-3 h-1 rounded-lg"> </p>
          )}
          <div className="pt-2 pb-4 mt-3 rounded-md">
            {recentDoneOrExpired.length > 0 && (
              <h2 className="pl-2 font-bold text-gray-300">Recent</h2>
            )}
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
                          handleRowClick(task.id, "", "", "", "", input, event)
                        }
                        style={{
                          backgroundColor: selectedRows.includes(task.id)
                            ? "#264653"
                            : "rgb(128, 151, 166)",
                        }}
                      >
                        {!isMobile && (
                          <td>
                            {task.date && datetimeFnc.getWeekDay(task.date)}
                          </td>
                        )}
                        <td>
                          {task.date
                            ? datetimeFnc.getDDMMYYYY(task.date.slice(0, 10))
                            : ""}
                        </td>
                        <td>{task.time ? task.time : ""}</td>
                        <td>{task.description}</td>
                        <td>{task.category}</td>
                        {!isMobile && (
                          <td>{task.relevUrgen ? task.relevUrgen : ""}</td>
                        )}
                        {!isMobile && <td>{task.periodRecurrence}</td>}
                        {!isMobile && (
                          <td>{task.state ? "Done" : "Pending"}</td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {farOff.length > 0 && (
              <h2 className="pl-2 mt-3 font-bold text-gray-300">Far-Off</h2>
            )}
            <div className="mt-1">
              <table
                id="output-table-pending"
                className="sm:min-w-[1400px] w-full text-gray-300 text-[12px] bg-custom-databg rounded-[7px]"
              >
                <tbody>
                  {pendingTasks &&
                    farOff.map((task) => (
                      <tr
                        key={task.id}
                        onClick={(event) =>
                          handleRowClick(task.id, "", "", "", "", input, event)
                        }
                        style={{
                          backgroundColor: selectedRows.includes(task.id)
                            ? "#264653"
                            : "transparent",
                        }}
                      >
                        {!isMobile && (
                          <td>{datetimeFnc.getWeekDay(task.date)}</td>
                        )}
                        <td>
                          {task.date
                            ? datetimeFnc.getDDMMYYYY(task.date.slice(0, 10))
                            : ""}
                        </td>
                        <td>{task.time ? task.time : ""}</td>
                        <td>{task.description}</td>
                        <td>{task.category}</td>
                        {!isMobile && <td></td>}
                        {!isMobile && <td>{task.periodRecurrence}</td>}
                        {!isMobile && (
                          <td>{task.state ? "Done" : "Pending"}</td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {allRecurring.length > 0 && (
            <p className="bg-secondary text-secondary mt-3 h-1 rounded-lg"> </p>
          )}
          <div className="pt-2 pb-4 mt-3 rounded-md">
            {allRecurring.length > 0 && (
              <h2 className="pl-2 font-bold text-gray-300">Recurring</h2>
            )}
            <div className="mt-1">
              <table
                id="output-table-pending"
                className="sm:min-w-[1400px] w-full text-gray-300 text-[12px] bg-custom-databg rounded-[7px]"
              >
                <tbody>
                  {pendingTasks &&
                    allRecurring.map((task) => (
                      <tr
                        key={task.id}
                        onClick={(event) =>
                          handleRowClick(task.id, "", "", "", "", input, event)
                        }
                        style={{
                          backgroundColor: selectedRows.includes(task.id)
                            ? "#264653"
                            : "transparent",
                        }}
                      >
                        {!isMobile && (
                          <td>
                            {task.date && datetimeFnc.getWeekDay(task.date)}
                          </td>
                        )}
                        <td>
                          {task.date
                            ? datetimeFnc.getDDMMYYYY(task.date.slice(0, 10))
                            : ""}
                        </td>
                        <td>{task.time ? task.time : ""}</td>
                        <td>{task.description}</td>
                        <td>{task.category}</td>
                        {!isMobile && <td></td>}
                        {!isMobile && (
                          <td>
                            {task.periodRecurrence ? task.periodRecurrence : ""}
                          </td>
                        )}
                        {!isMobile && (
                          <td>{task.state ? "Done" : "Pending"}</td>
                        )}
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

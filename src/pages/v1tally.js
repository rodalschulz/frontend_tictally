import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { MdAccessTimeFilled, MdMenuOpen } from "react-icons/md";
import { FaArrowAltCircleUp, FaArrowAltCircleLeft } from "react-icons/fa";

import {
  postUserActivityData,
  patchUserActivityData,
  queryUserActivityData,
} from "../sdk_backend_fetch.js";
import DownloadCSV from "../components/downloadCSVbtn.js";
import UploadCSVbtn from "../components/uploadCSVbtn.js";
import Sidebar from "../components/sidebar.js";
import Instructions from "../components/instructions.js";
import PopupInstructions from "../components/popupInstructions.js";
import HoverableRowGuide from "../components/hoverableRow.js";
import EntrySearchToggleButton from "../components/entrySearchModebtn.js";
import useFetchCategoryConfig from "../hooks/useFetchCategoryConfig.js";
import useWindowSize from "../hooks/useWindowSize.js";
import useUserActivityData from "../hooks/useFetchActivityData.js";
import useRowNavigation from "../hooks/useRowNavigation.js";
import datetimeFnc from "../utils/datetimeUtl.js";
import activityData from "../utils/tallyValidation.js";
import "../styles/v1members.css";

const Tally = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [displayInstructions, setDisplayInstructions] = useState(false);
  const isMobile = useWindowSize();
  const [hoveredHeader, setHoveredHeader] = useState(null);
  const [popupText, setPopupText] = useState("");

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showUTC, setShowUTC] = useState(false);
  const [queryTimeSum, setQueryTimeSum] = useState(0);
  const [patchSubmitted, setPatchSubmitted] = useState(false);

  const { subcategories } = useFetchCategoryConfig(userId);
  const {
    userActivityData,
    setUserActivityData,
    fetchUserActivityData,
    activityDataFetched,
  } = useUserActivityData(userId, 32, setIsLoading);

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
    setIsLoading(true);
    const queryParams = new URLSearchParams();
    if (input.description) queryParams.append("description", input.description);
    if (input.category) queryParams.append("category", input.category);
    if (input.subcategory) queryParams.append("subcategory", input.subcategory);
    if (input.date) queryParams.append("date", input.date);
    if (input.date2) queryParams.append("date2", input.date2);

    resetForm();
    try {
      const data = await queryUserActivityData(userId, queryParams);
      setUserActivityData(data.userActivityData);
      setQueryTimeSum(data.totalSum);
      console.log("Query finished");
    } catch (error) {
      console.error("Error fetching activity data:", error);
    }
    setIsLoading(false);
  };

  const submitPatch = async (event) => {
    setIsLoading(true);
    try {
      const idsToPatch = selectedRows;
      const { startTime, endTime, adjustment } = selectedRowTimeValues;
      const updatedInput = activityData.activityPatchValidation(
        input,
        startTime,
        endTime,
        adjustment,
        event
      );
      if (
        (updatedInput.startTime ||
          updatedInput.endTime ||
          updatedInput.adjustment) &&
        selectedRows.length > 1
      ) {
        alert("Can't patch multiple entries with different times.");
        setSelectedRows([]);
        setSelectedRowTimeValues({
          startTime: "",
          endTime: "",
          adjustment: 0,
        });
        resetForm();
        setIsLoading(false);
        return;
      }
      await patchUserActivityData(userId, idsToPatch, updatedInput);
      setSelectedRows([]);
      setSelectedRowTimeValues({
        startTime: "",
        endTime: "",
        adjustment: 0,
      });
      resetForm();
      fetchUserActivityData();
    } catch (error) {
      console.error(error);
      setSelectedRows([]);
      setSelectedRowTimeValues({
        startTime: null,
        endTime: null,
        adjustment: 0,
      });
    }
    resetForm();
    setIsLoading(false);
  };

  const submit = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsLoading(true);
    if (isSearchMode) {
      await submitSearch(event);
    } else if (selectedRows.length > 0 && !isSearchMode) {
      await submitPatch(event);
      setPatchSubmitted(true); // only for instruction purposes
    } else {
      try {
        const lastEndTime = userActivityData[0]?.endTime;
        const updatedInput = activityData.activityEntryValidation(
          input,
          event,
          lastEndTime,
          fetchUserActivityData
        );
        if (!input.category) {
          alert("Mandatory field: Category");
          setIsLoading(false);
          return;
        }
        await postUserActivityData(userId, updatedInput);
        fetchUserActivityData();
        resetForm();
      } catch (error) {
        console.error(error);
        if (error.message === "End time can't be lower than start time.") {
          console.log("Please, fix the time error.");
        } else {
          resetForm();
        }
      }
    }
    setIsLoading(false);
  };

  const {
    selectedRows,
    selectedRowTimeValues,
    handleRowClick,
    deleteSelected,
    setSelectedRows,
    setSelectedRowTimeValues,
    newInput,
  } = useRowNavigation(
    userId,
    userActivityData,
    fetchUserActivityData,
    submit,
    setIsLoading
  );

  useEffect(() => {
    if (newInput) {
      setInput(newInput);
    }
  }, [newInput]);

  const handleSearchToggle = () => {
    setIsSearchMode((prevMode) => !prevMode);
  };

  const refreshTally = () => {
    window.location.href = `/members/${userId}/tally`;
  };

  const openSidebar = () => {
    setShowSidebar(true);
  };

  // Instructions for new users
  const [instructionSteps, setInstructionSteps] = useState(0);
  useEffect(() => {
    if (
      activityDataFetched &&
      userActivityData.length === 0 &&
      instructionSteps === 0
    ) {
      setInstructionSteps(1);
      return;
    }

    if (instructionSteps === 1 && !showSidebar) {
      setInstructionSteps(2);
    } else if (instructionSteps === 2 && showSidebar) {
      setInstructionSteps(3);
    } else if (
      activityDataFetched &&
      userActivityData.length > 0 &&
      instructionSteps === 3
    ) {
      setInstructionSteps(4);
    } else if (instructionSteps === 4 && patchSubmitted) {
      setInstructionSteps(5);
    } else if (
      activityDataFetched &&
      userActivityData.length === 0 &&
      instructionSteps === 5
    ) {
      setInstructionSteps(null);
    }
  }, [userActivityData, displayInstructions, instructionSteps, showSidebar]);

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      <div className="absolute z-50 mt-[50vh] bg-secondary text-white rounded-r-md">
        {!showSidebar && (
          <button className="ml-1 mt-1" onClick={openSidebar}>
            <MdMenuOpen />
          </button>
        )}
      </div>
      <div className="z-40">
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
        <div className=""></div>
        {userActivityData.length === 0 && instructionSteps === 1 && (
          <div className="absolute mt-[40vh] ml-[70px] bg-custom-yellow rounded-lg p-6 text-white flex items-center">
            <FaArrowAltCircleLeft className="text-[32px]" />
            <span className="ml-4">Click the sidebar to hide it!</span>
          </div>
        )}
        {instructionSteps === 2 && (
          <div className="absolute mt-[48vh] ml-[27px] bg-custom-yellow rounded-lg p-6 text-white flex items-center">
            <FaArrowAltCircleLeft className="text-[32px]" />
            <span className="ml-4">Now click this button to show it!</span>
          </div>
        )}
      </div>
      <main
        className={`flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2 xs:max-w-full sm:max-w-[2000px] ${
          showSidebar && "ml-16"
        }`}
      >
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white mr-5 flex justify-between items-center">
          <span onClick={refreshTally}>
            <button>My Tally</button>
          </span>
          <span className="text-sm flex">
            {!isMobile && (
              <button
                className="btn bg-custom-databg btn-sm mr-2 w-10 border-gray-800 hover:bg-primary"
                onClick={() => setShowUTC(!showUTC)}
              >
                <MdAccessTimeFilled />
              </button>
            )}
            {!isMobile && <UploadCSVbtn />}
            {!isMobile && <DownloadCSV DownloadCSV userId={userId} />}
          </span>
        </h1>

        <div className="">
          <div className="sticky top-1">
            <section id="input-header" className="">
              <form ref={formRef} onSubmit={submit}>
                <table
                  id="input-table"
                  className="sm:min-w-[1400px] w-full text-white text-sm mr-5 rounded-[7px] bg-gray-800"
                >
                  <thead>
                    <HoverableRowGuide
                      setPopupText={setPopupText}
                      setHoveredHeader={setHoveredHeader}
                    >
                      {!isMobile && (
                        <th>
                          ENT/SRCH
                          {hoveredHeader === "ENT/SRCH" && (
                            <PopupInstructions
                              text={popupText}
                              className="text-red-500"
                            />
                          )}
                        </th>
                      )}
                      {!isMobile && (
                        <th>
                          DATE
                          {hoveredHeader === "DATE" && (
                            <PopupInstructions text={popupText} />
                          )}
                        </th>
                      )}
                      {!isMobile && (
                        <th className="relative">
                          <div className="flex items-center justify-center relative">
                            <span className="absolute left-1/2 transform -translate-x-1/2">
                              DESCRIPTION
                            </span>
                            {isSearchMode ? (
                              <span className="text-yellow-300 absolute left-2 text-[11px]">
                                {" "}
                                Search Mode
                              </span>
                            ) : selectedRows.length > 0 ? (
                              <span className="text-custom-editMode absolute left-2 text-[11px]">
                                {" "}
                                Edit Mode
                              </span>
                            ) : (
                              <span className="text-gray-400 absolute left-2 text-[11px]">
                                {" "}
                                Entry Mode
                              </span>
                            )}
                            {hoveredHeader === "DESCRIPTION Entry Mode" && (
                              <PopupInstructions text={popupText} />
                            )}
                          </div>
                        </th>
                      )}
                      <th>
                        CATEG
                        {hoveredHeader === "CATEG" && (
                          <PopupInstructions text={popupText} />
                        )}
                      </th>
                      <th>
                        SUBCAT
                        {hoveredHeader === "SUBCAT" && (
                          <PopupInstructions text={popupText} />
                        )}
                      </th>
                      <th>
                        START
                        {hoveredHeader === "START" && (
                          <PopupInstructions text={popupText} />
                        )}
                      </th>
                      <th>END</th>
                      {!isMobile && (
                        <th>
                          ADJ
                          {hoveredHeader === "ADJ" && (
                            <PopupInstructions text={popupText} />
                          )}
                        </th>
                      )}
                      <th>
                        TIME
                        {hoveredHeader === "TIME" && (
                          <PopupInstructions text={popupText} />
                        )}
                      </th>
                      {showUTC && !isMobile && (
                        <>
                          <th>UTC</th>
                          <th>CREATED UTC</th>
                          <th>UPDATED UTC</th>
                        </>
                      )}
                    </HoverableRowGuide>
                  </thead>
                  <tbody>
                    <tr>
                      {!isMobile && (
                        <td>
                          {" "}
                          <EntrySearchToggleButton
                            isSearchMode={isSearchMode}
                            handleClick={handleSearchToggle}
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
                            value={input.description || ""}
                            className={`data-input description-input`}
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
                          <option value="CORE">CORE</option>
                          <option value="WORK">WORK</option>
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
          {instructionSteps === 3 && (
            <div className="flex flex-col items-center justify-center absolute mt-2 ml-10 bg-custom-yellow rounded-lg p-6 text-white mr-5">
              <p className="text-[32px]">
                <FaArrowAltCircleUp />
              </p>
              <p className="mt-2">Make a TEST entry!</p>
              <br />
              <p>Select a random CATEGORY and press ENTER</p>
              <p></p>
              <br />
              <p>
                If on mobile, instead of ENTER, press the sidebar's light gray
                button!
              </p>
            </div>
          )}
          {instructionSteps === 4 && (
            <div className="flex flex-col items-center justify-center absolute mt-12 ml-10 bg-custom-yellow rounded-lg p-6 text-white mr-5">
              <p className="text-[32px]">
                <FaArrowAltCircleUp />
              </p>
              <p className="mt-2">Your first entry! Lets modify it!</p>
              <br />
              <p>As you can see, it auto filled the DATE and START time.</p>
              <br />
              <p>
                Now, select the entry, pick a DIFFERENT category and press ENTER
                again.
              </p>
            </div>
          )}
          {instructionSteps === 5 && (
            <div className="flex flex-col items-center justify-center absolute mt-12 ml-10 bg-custom-yellow rounded-lg p-6 text-white mr-5">
              <p className="text-[32px]">
                <FaArrowAltCircleUp />
              </p>
              <p className="mt-2">You modified it! Well done!</p>
              <br />
              <p>Now select the entry and press DELETE on your keyboard.</p>
              <br />
              <p>
                If on mobile, instead of DELETE, click the sidebar's darkest
                button!
              </p>
            </div>
          )}
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-gray-100 p-4 rounded-lg shadow-lg flex items-center justify-center">
                <FaSpinner className="text-4xl text-primary animate-spin" />
              </div>
            </div>
          )}
          {!isLoading &&
            ((userActivityData.length === 0 && instructionSteps === null) ||
              displayInstructions) && <Instructions pageName="tally" />}
          <div>
            <table
              id="data"
              className="sm:min-w-[1400px] w-full text-white text-[12px] bg-custom-databg rounded-[7px] mr-5 mt-3"
            >
              <tbody>
                {userActivityData.map((activity, index, array) => {
                  const currentStartTime = datetimeFnc.timeStringToMinutes(
                    activity.startTime
                  );
                  const nextEndTime =
                    index < array.length - 1 &&
                    activity.date === array[index + 1].date
                      ? datetimeFnc.timeStringToMinutes(
                          array[index + 1].endTime
                        )
                      : null;

                  return (
                    <tr
                      key={activity.id}
                      onClick={(event) =>
                        handleRowClick(
                          activity.id,
                          activity.startTime,
                          activity.endTime,
                          activity.adjustment,
                          activity.description,
                          input,
                          event
                        )
                      }
                      style={{
                        backgroundColor: selectedRows.includes(activity.id)
                          ? "#264653"
                          : "transparent",
                        color:
                          nextEndTime !== null && currentStartTime < nextEndTime
                            ? "red"
                            : "inherit",
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
                          {activity.adjustment === 0
                            ? "-"
                            : activity.adjustment}
                        </td>
                      )}
                      <td>
                        {datetimeFnc.convertMinutesToHHMM(
                          activity.totalTimeMin
                        )}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tally;

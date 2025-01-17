import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdMenuOpen } from "react-icons/md";

import { updateUserCategoryConfig } from "../sdk_backend_fetch.js";
import Sidebar from "../components/sidebar.js";
import Instructions from "../components/instructions.js";
import HoverableRowGuide from "../components/hoverableRow.js";
import PopupInstructions from "../components/popupInstructions.js";
import useFetchCategoryConfig from "../hooks/useFetchCategoryConfig.js";
import useWindowSize from "../hooks/useWindowSize.js";
import configValidation from "../utils/configValidation.js";

const Categories = () => {
  const { userId } = useParams();
  const [showSidebar, setShowSidebar] = useState(true);
  const [displayInstructions, setDisplayInstructions] = useState(false);
  const isMobile = useWindowSize();
  const [hoveredHeader, setHoveredHeader] = useState(null);
  const [popupText, setPopupText] = useState("");

  const {
    subcategories: fetchedSubcategories,
    coreLimits: fetchedCoreLimits,
    subcatsToTrack: fetchedSubcatsToTrack,
    dataFetched: dataFetched,
  } = useFetchCategoryConfig(userId);

  const defaultCoreLimits = {
    SLEEP: "",
    EAT: "",
    GROOM: "",
    FITNESS: "",
    RELIEF: "",
    INFORM: "",
  };
  const defaultSubcategories = {
    GENERAL: Array(10).fill(""),
    WORK: Array(10).fill(""),
    LEARN: Array(10).fill(""),
    BUILD: Array(10).fill(""),
    RECOVERY: Array(10).fill(""),
  };
  const [coreLimits, setCoreLimitsState] = useState(defaultCoreLimits);
  const [subcategories, setSubcategoriesState] = useState(defaultSubcategories);
  const [subcatsToTrack, setSubcatsToTrack] = useState({});

  useEffect(() => {
    if (fetchedCoreLimits && Object.keys(fetchedCoreLimits).length > 0) {
      setCoreLimitsState(fetchedCoreLimits);
    }
  }, [fetchedCoreLimits]);

  useEffect(() => {
    if (fetchedSubcategories && Object.keys(fetchedSubcategories).length > 0) {
      setSubcategoriesState(fetchedSubcategories);
    }
  }, [fetchedSubcategories]);

  useEffect(() => {
    if (fetchedSubcatsToTrack && fetchedSubcatsToTrack.length > 0) {
      setSubcatsToTrack(fetchedSubcatsToTrack);
    }
  }, [fetchedSubcatsToTrack]);

  const handleInputChange = (event, rowIndex, columnIndex, category) => {
    const { value } = event.target;
    setSubcategoriesState((prevSubcategories) => {
      const newSubcategories = { ...prevSubcategories };
      newSubcategories[category][rowIndex] = value;
      return newSubcategories;
    });
  };

  const handleCoreLimitChange = (event) => {
    const { name, value } = event.target;
    setCoreLimitsState((prevCoreLimits) => ({
      ...prevCoreLimits,
      [name]: value,
    }));
  };

  const submitForm = async () => {
    const cleanSubcategories = Object.fromEntries(
      Object.entries(subcategories).map(([key, value]) => [
        key,
        value.filter((subcat) => subcat !== ""),
      ])
    );

    const cleanSubcategoriesUpper = Object.fromEntries(
      Object.entries(cleanSubcategories).map(([key, value]) => [
        key,
        value.map((subcat) => subcat.toUpperCase()),
      ])
    );

    const cleanedCoreLimits =
      configValidation.cleanAndValidateCoreLimits(coreLimits);

    const data = {
      coreLimits: cleanedCoreLimits,
      subcategories: cleanSubcategoriesUpper,
      subcatsToTrack: Object.values(subcatsToTrack).filter(
        (subcat) => subcat.subcat !== ""
      ),
    };

    try {
      await updateUserCategoryConfig(userId, data);
      alert("Configuration updated successfully!");
    } catch (error) {
      console.error("Error updating configuration:", error);
      alert("There was an error updating the configuration.");
    }
  };

  const openSidebar = () => {
    setShowSidebar(true);
  };

  useEffect(() => {
    if (dataFetched) {
      if (subcategories.GENERAL[0] === "" && coreLimits.SLEEP === "") {
        setDisplayInstructions(true);
        console.log("No data fetched");
      }
    }
  }, [dataFetched]);

  return (
    <div className="flex h-screen bg-zinc-950 overflow-x-auto">
      <div className="absolute z-50 mt-[50vh] bg-secondary text-white rounded-r-md">
        {!showSidebar && (
          <button className="ml-1 mt-1" onClick={openSidebar}>
            <MdMenuOpen />
          </button>
        )}
      </div>
      <Sidebar
        userId={userId}
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
        <div className="xs:w-[220vw] sm:w-full">
          <h1 className="w-[100%] text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white">
            Configuration
          </h1>
          {displayInstructions && <Instructions pageName="config" />}
          <div className="w-[100%] overflow-x-auto">
            <div className="flex font-bold">
              <div className="bg-secondary text-white text-center py-1 mb-2 min-w-[162px]">
                Core Category
              </div>
              <div className="bg-secondary text-white text-center py-1 mb-2 ml-2 min-w-[720px]">
                Custom Subcategories
              </div>
              <div className="bg-secondary text-white text-center py-1 mb-2 ml-2 min-w-[296px]">
                10K Goal Tracking
              </div>
            </div>
            <form className="flex">
              <table className="rounded-lg shadow-md w-[150px]">
                <thead className="bg-primary text-white">
                  <HoverableRowGuide
                    setHoveredHeader={setHoveredHeader}
                    setPopupText={setPopupText}
                  >
                    <th className="px-7 py-2 text-sm" colSpan={2}>
                      Daily Limits{" "}
                      {hoveredHeader === "Daily Limits" && (
                        <PopupInstructions text={popupText} />
                      )}
                    </th>
                  </HoverableRowGuide>
                </thead>
                <tbody className="text-[13px] bg-black text-white">
                  {Object.keys(coreLimits).map((limit, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{limit}</td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name={limit}
                          value={coreLimits[limit]}
                          onChange={handleCoreLimitChange}
                          className="w-12 pl-2 bg-zinc-700 rounded-lg"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="ml-2 rounded-lg shadow-md w-[720px]">
                <thead className="bg-primary text-white">
                  <HoverableRowGuide
                    setHoveredHeader={setHoveredHeader}
                    setPopupText={setPopupText}
                  >
                    <th className="px-7 py-2 text-sm">
                      General{" "}
                      {hoveredHeader === "General" && (
                        <PopupInstructions text={popupText} />
                      )}
                    </th>
                    <th className="px-7 py-2 text-sm">
                      Work{" "}
                      {hoveredHeader === "Work" && (
                        <PopupInstructions text={popupText} />
                      )}
                    </th>
                    <th className="px-7 py-2 text-sm">
                      Learn{" "}
                      {hoveredHeader === "Learn" && (
                        <PopupInstructions text={popupText} />
                      )}
                    </th>
                    <th className="px-7 py-2 text-sm">
                      Build{" "}
                      {hoveredHeader === "Build" && (
                        <PopupInstructions text={popupText} />
                      )}
                    </th>
                    <th className="px-7 py-2 text-sm">
                      Recovery{" "}
                      {hoveredHeader === "Recovery" && (
                        <PopupInstructions text={popupText} />
                      )}
                    </th>
                  </HoverableRowGuide>
                </thead>
                <tbody className="text-[13px] bg-black">
                  {Array.from({ length: 10 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(subcategories).map(
                        (category, columnIndex) => (
                          <td key={category} className="px-2 py-2">
                            <input
                              type="text"
                              className="w-32 pl-2 rounded-lg bg-zinc-900 text-white"
                              value={subcategories[category][rowIndex] || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  rowIndex,
                                  columnIndex,
                                  category
                                )
                              }
                            />
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="ml-2 rounded-lg shadow-md w-[296px]">
                <thead className="bg-primary text-white text-sm">
                  <tr>
                    <th className="px-7 py-2">Subcategory</th>
                    <th className="px-7 py-2">Start Date</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] bg-black">
                  {Array.from({ length: 3 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          className="w-32 pl-2 bg-zinc-900 text-white rounded-lg"
                          value={subcatsToTrack[rowIndex]?.subcat || ""}
                          onChange={(e) =>
                            setSubcatsToTrack((prev) => ({
                              ...prev,
                              [rowIndex]: {
                                ...prev[rowIndex],
                                subcat: e.target.value,
                              },
                            }))
                          }
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="date"
                          className="w-32 pl-2 bg-zinc-900 text-white rounded-lg"
                          value={subcatsToTrack[rowIndex]?.startDate || ""}
                          onChange={(e) =>
                            setSubcatsToTrack((prev) => ({
                              ...prev,
                              [rowIndex]: {
                                ...prev[rowIndex],
                                startDate: e.target.value,
                              },
                            }))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </form>
          </div>
          <div className="mt-2">
            <button
              className="bg-zinc-900 rounded-lg p-4 text-white font-bold"
              onClick={submitForm}
            >
              Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;

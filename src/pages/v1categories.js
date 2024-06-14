import * as SDK from "../sdk_backend_fetch.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdMenuOpen } from "react-icons/md";

import Sidebar from "../components/sidebar.js";
import useFetchCategoryConfig from "../baseComponents/useFetchCategoryConfig.js";
import useWindowSize from "../baseComponents/useWindowSize.js";
import configValidation from "../functions/configValidation.js";
import Instructions from "../components/instructions.js";

const Categories = () => {
  const { userId } = useParams();
  const [showSidebar, setShowSidebar] = useState(true);
  const {
    subcategories: fetchedSubcategories,
    coreLimits: fetchedCoreLimits,
    dataFetched: dataFetched,
  } = useFetchCategoryConfig(userId);
  const isMobile = useWindowSize();
  const [displayInstructions, setDisplayInstructions] = useState(false);

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
    };

    try {
      await SDK.updateUserCategoryConfig(userId, data);
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
      console.log("Data fetched", subcategories, coreLimits);
      if (subcategories.GENERAL[0] === "" && coreLimits.SLEEP === "") {
        setDisplayInstructions(true);
        console.log("No data fetched");
      }
    }
  }, [dataFetched]);

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
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
            Category Configuration
          </h1>
          {displayInstructions && <Instructions pageName="config" />}
          <div className="w-[100%] overflow-x-auto">
            <form className="flex">
              <table className="rounded-lg bg-secondary shadow-md">
                <thead className="bg-secondary text-white">
                  <tr>
                    <th className="px-7 py-2" colSpan={2}>
                      CORE LIMITS
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[13px] bg-gray-200">
                  {Object.keys(coreLimits).map((limit, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{limit}</td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name={limit}
                          value={coreLimits[limit]}
                          onChange={handleCoreLimitChange}
                          className="w-12 pl-2 bg-white rounded-lg"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="ml-2 rounded-lg shadow-md">
                <thead className="bg-secondary text-white">
                  <tr>
                    <th className="px-7 py-2">GENERAL</th>
                    <th className="px-7 py-2">WORK</th>
                    <th className="px-7 py-2">LEARN</th>
                    <th className="px-7 py-2">BUILD</th>
                    <th className="px-7 py-2">RECOVERY</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] bg-gray-200">
                  {Array.from({ length: 10 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(subcategories).map(
                        (category, columnIndex) => (
                          <td key={category} className="px-2 py-2">
                            <input
                              type="text"
                              className="w-32 pl-2 bg-white rounded-lg"
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
            </form>
          </div>
          <div className="mt-2">
            <button
              className="bg-primary rounded-lg p-4 text-white font-bold"
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

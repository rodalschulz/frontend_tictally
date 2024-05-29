import * as SDK from "../sdk_backend_fetch.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../components/sidebar.js";

import useFetchCategoryConfig from "../baseComponents/useFetchCategoryConfig.js";
import useWindowSize from "../baseComponents/useWindowSize.js";

const Categories = () => {
  const { userId } = useParams();
  const { subcategories, coreLimits, setCoreLimits, setSubcategories } =
    useFetchCategoryConfig(userId);
  const isMobile = useWindowSize();

  const handleInputChange = (event, rowIndex, columnIndex, category) => {
    const { value } = event.target;
    setSubcategories((prevSubcategories) => {
      const newSubcategories = { ...prevSubcategories };
      newSubcategories[category][rowIndex] = value;
      return newSubcategories;
    });
  };

  const handleCoreLimitChange = (event) => {
    const { name, value } = event.target;
    setCoreLimits((prevCoreLimits) => ({
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

    const data = {
      coreLimits: { ...coreLimits },
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

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      <Sidebar userId={userId} />

      <main className="flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2 ml-16">
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold mr-5 flex justify-between items-center text-white">
          Category Configuration
        </h1>
        <div className="w-44">
          <div>
            <form className="flex">
              <table className="min-w-full rounded-lg bg-secondary shadow-md mr-2">
                <thead className="bg-secondary rounded-lg text-white">
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
              <table className="min-w-full rounded-lg shadow-md mr-2">
                <thead className="bg-secondary rounded-lg text-white">
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
          <div>
            <button
              className="bg-primary rounded-lg p-4 mt-2 text-white font-bold"
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
